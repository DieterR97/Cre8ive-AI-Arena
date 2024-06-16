import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Image, Modal, TouchableWithoutFeedback, ActivityIndicator, SafeAreaView } from 'react-native';

// import Video from 'react-native-video';
import { Video, AVPlaybackStatus, Audio } from 'expo-av';
import { collection, query, where, getDocs, doc } from "firebase/firestore";
import { db } from "../firebase.js";
import { getAuth } from 'firebase/auth';

import { useFocusEffect } from '@react-navigation/native';

function CompetitionListScreen({ route, navigation }) {

    const [isLoading, setIsLoading] = useState(true);

    const [selectedImage, setSelectedImage] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const [currentSoundUri, setCurrentSoundUri] = useState(null);
    const [isAudPlaying, setIsAudPlaying] = useState(false);
    const soundRef = useRef(new Audio.Sound());

    const [playingVideoId, setPlayingVideoId] = useState(null); // Track the currently playing video

    const [videoLoadingStatus, setVideoLoadingStatus] = useState({}); // Track loading state for each video

    const videoRefs = useRef({});

    useEffect(() => {
        // Initialize videoRefs with submission ids
        submissions.forEach(submission => {
            if (submission.competitionType === 'video') {
                videoRefs.current[submission.id] = React.createRef();
            }
        });
    }, [submissions]);



    const handlePauseAudio = async () => {
        try {
            if (soundRef.current._loaded) {
                setIsAudPlaying(false);
                await soundRef.current.pauseAsync();
            }
        } catch (error) {
            console.error("Error pausing audio:", error);
        }
    };

    // useFocusEffect(
    //     React.useCallback(() => {
    //         return () => {
    //             handlePauseAudio();
    //         };
    //     }, [])
    // );

    useFocusEffect(
        useCallback(() => {
            return () => {
                handlePauseAudio();
                resetPlayingVideo();
            };
        }, [])
    );

    // const [sound, setSound] = useState();

    // Update the handleImagePress function to set the selected image URL and make the modal visible
    const handleImagePress = (imageUrl) => {
        setSelectedImage(imageUrl);
        setModalVisible(true);
    };

    // Add a function to handle closing the modal
    const handleModalClose = () => {
        setModalVisible(false);
        setSelectedImage(null);
    };

    const videoRef = useRef(null);
    const [isMuted, setIsMuted] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isVideoLoading, setIsVideoLoading] = useState(true);


    const auth = getAuth();
    const userId = auth.currentUser.uid;

    console.log("Received params:", route.params);

    // Check for route params properly
    if (!route || !route.params) {
        navigation.goBack();
        return null;
    }

    const { category } = route.params;
    console.log("Category:", category);

    // Handle undefined category
    if (!category) {
        // For example, navigate back to the previous screen
        navigation.goBack();
        return null; // Or return a message or loading indicator
    }

    const handleVideoLoad = () => {
        setIsVideoLoading(false);
    };

    const handleVideoPress = async (id) => {
        try {
            setPlayingVideoId(playingVideoId === id ? null : id);
            setIsMuted(playingVideoId === id);  // Only unmute the clicked video if it's not already playing
            setIsFullscreen(true);

            // Enter fullscreen if the video should play
            if (playingVideoId !== id) {
                const videoRef = videoRefs.current[id];
                if (videoRef && videoRef.current) {
                    await videoRef.current.presentFullscreenPlayer();
                }
            }
        } catch (error) {
            console.error("Error presenting fullscreen video:", error);
        }
    };



    const handleFullscreenUpdate = (event) => {
        if (event.fullscreenUpdate === Video.FULLSCREEN_UPDATE_PLAYER_DID_PRESENT) {
            setIsFullscreen(true);
            setIsMuted(false);
        } else if (event.fullscreenUpdate === Video.FULLSCREEN_UPDATE_PLAYER_WILL_DISMISS) {
            setIsFullscreen(false);
            setIsMuted(true);
        }
    };

    const [submissions, setSubmissions] = useState([]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const q = query(collection(db, `submissions/${category}/${category}`));
            const querySnapshot = await getDocs(q);
            const fetchedSubmissions = [];
            querySnapshot.forEach((doc) => {
                fetchedSubmissions.push({ id: doc.id, ...doc.data() });
            });
            setSubmissions(fetchedSubmissions);
            console.log("Fetched submissions:", fetchedSubmissions);
        } catch (error) {
            console.error("Failed to fetch submissions:", error);
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        fetchData();
    }, [category]);

    const playSound = async (aud_uri) => {
        try {
            if (isAudPlaying && currentSoundUri === aud_uri) {
                setIsAudPlaying(false);
                await soundRef.current.pauseAsync();
            } else {
                if (soundRef.current._loaded) {
                    await soundRef.current.unloadAsync();
                }
                await soundRef.current.loadAsync({ uri: aud_uri });
                await soundRef.current.playAsync();
                setIsAudPlaying(true);
                setCurrentSoundUri(aud_uri);
            }
        } catch (error) {
            console.error("Error playing sound:", error);
        }
    };



    const handleSubmission = () => {
        navigation.navigate('Submission', { category });
    };

    const resetPlayingVideo = () => setPlayingVideoId(null);  // Reset the playing video state

    return (
        // <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: "100%" }}>
        <View style={styles.container}>
            {isLoading ? (

                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>

            ) : submissions.length === 0 ? (
                <>
                    {/* <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}> */}
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        {/* Your FlatList and other components */}
                        <Button title="Submit Entry" onPress={handleSubmission} />
                    </View>
                    <Text>No submissions found.</Text>
                </>
            ) : (
                <>
                    <View>
                        {/* Your FlatList and other components */}
                        <Button title="Submit Entry" onPress={handleSubmission} />
                    </View>
                    <SafeAreaView style={styles.safecontainer}>
                        <FlatList
                            style={styles.flatlist_container}
                            horizontal={false}
                            numColumns={2}
                            // contentContainerStyle={{ alignItems: 'flex-start' }}
                            // contentContainerStyle={{ justifyContent: 'start' }}
                            columnWrapperStyle={styles.columnWrapper}
                            data={submissions}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (

                                item.competitionType === 'image' ? (
                                    // Render content for the 'image' category
                                    <View style={styles.itemContainer}>

                                        <View
                                            style={styles.video_item}
                                        >

                                            <TouchableWithoutFeedback onPress={() => handleImagePress(item.fileUrl)}>
                                                <View>
                                                    <Image
                                                        ref={videoRef}
                                                        source={{ uri: item.fileUrl }}
                                                        // style={styles.images}
                                                        rate={1.0}
                                                        volume={1.0}
                                                        isMuted={isMuted}
                                                        // isMuted={true}
                                                        resizeMode="cover"
                                                        shouldPlay
                                                        isLooping
                                                        style={styles.video}
                                                        onFullscreenUpdate={handleFullscreenUpdate}
                                                        onLoad={handleVideoLoad}
                                                    />
                                                    {isVideoLoading && (
                                                        <View style={styles.loadingOverlay}>
                                                            <ActivityIndicator size="large" color="#ffffff" />
                                                        </View>
                                                    )}
                                                </View>
                                            </TouchableWithoutFeedback>
                                            <Text>{item.title} - {item.description}</Text>

                                            {/* // Render the modal with the selected image when modalVisible is true */}
                                            <Modal visible={modalVisible} transparent={true}>
                                                <TouchableWithoutFeedback onPress={handleModalClose}>
                                                    <View style={styles.modalContainer}>
                                                        <Image source={{ uri: selectedImage }} style={styles.fullscreenImage} resizeMode="contain" />
                                                    </View>
                                                </TouchableWithoutFeedback>
                                            </Modal>

                                        </View>

                                    </View>

                                ) : item.competitionType === 'video' ? (
                                    // Render content for the 'video' category



                                        <View style={styles.itemContainer}>

                                            <View
                                                style={styles.video_item}
                                            >

                                                <TouchableWithoutFeedback onPress={() => handleVideoPress(item.id)}>
                                                    <View>
                                                        <Video
                                                            // ref={videoRef}
                                                            ref={videoRefs.current[item.id]}

                                                            source={{ uri: item.fileUrl }}
                                                            // style={styles.images}
                                                            rate={1.0}
                                                            volume={1.0}

                                                            // isMuted={isMuted}

                                                            isMuted={playingVideoId !== item.id || isMuted}  // Mute if the video is not playing or if isMuted is true

                                                            // isMuted={true}
                                                            resizeMode="cover"
                                                            shouldPlay
                                                            isLooping
                                                            style={styles.video}


                                                            onFullscreenUpdate={(event) => handleFullscreenUpdate(event, item.id)}
                                                            onLoadStart={() => setVideoLoadingStatus(prevState => ({ ...prevState, [item.id]: true }))}
                                                            onLoad={() => setVideoLoadingStatus(prevState => ({ ...prevState, [item.id]: false }))}


                                                            // onFullscreenUpdate={handleFullscreenUpdate}
                                                            // onLoad={handleVideoLoad}



                                                            onPlaybackStatusUpdate={(status) => {
                                                                if (status.didJustFinish && !status.isLooping) {
                                                                    setPlayingVideoId(null);  // Reset playing video when it finishes
                                                                }
                                                            }}


                                                        />


                                                        {videoLoadingStatus[item.id] && (
                                                            <View style={styles.loadingOverlay}>
                                                                <ActivityIndicator size="large" color="#ffffff" />
                                                            </View>
                                                        )}


                                                        {/* {isVideoLoading && (
                                                        <View style={styles.loadingOverlay}>
                                                            <ActivityIndicator size="large" color="#ffffff" />
                                                        </View>
                                                    )} */}


                                                    </View>
                                                </TouchableWithoutFeedback>

                                                <Text>{item.title} - {item.description}</Text>

                                            </View>

                                        </View>

                                ) : item.competitionType === 'animation' ? (
                                    // Render content for the 'animation' category
                                    <View style={styles.itemContainer}>

                                        <View
                                            style={styles.video_item}
                                        >

                                            <TouchableWithoutFeedback onPress={handleVideoPress}>
                                                <View>
                                                    <Video
                                                        ref={videoRef}
                                                        source={{ uri: item.fileUrl }}
                                                        // style={styles.images}
                                                        rate={1.0}
                                                        volume={1.0}
                                                        isMuted={isMuted}
                                                        // isMuted={true}
                                                        resizeMode="cover"
                                                        shouldPlay
                                                        isLooping
                                                        style={styles.video}
                                                        onFullscreenUpdate={handleFullscreenUpdate}
                                                        onLoad={handleVideoLoad}
                                                    />
                                                    {isVideoLoading && (
                                                        <View style={styles.loadingOverlay}>
                                                            <ActivityIndicator size="large" color="#ffffff" />
                                                        </View>
                                                    )}
                                                </View>
                                            </TouchableWithoutFeedback>

                                            <Text>{item.title} - {item.description}</Text>

                                        </View>

                                    </View>

                                ) : item.competitionType === 'audio' ? (
                                    // Render content for the 'audio' category
                                    <View 
                                    style={styles.audio_btn_container}
                                    >
                                        <Button
                                            style={styles.audio_btn}
                                            onPress={() => playSound(item.fileUrl)}
                                            title={isAudPlaying && currentSoundUri === item.fileUrl ? `Pause Sound: ${item.title}` : `Play : ${item.title}`}
                                        />
                                    </View>
                                ) : (
                                    // Render default content if category doesn't match any of the above
                                    // <DefaultComponent />
                                    <></>
                                )
                            )}
                        />
                    </SafeAreaView>
                </>
            )
            }
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        backgroundColor: '#f5fcff',
    },
    submitButtonContainer: {
        marginVertical: 20,
    },
    safecontainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    images: {
        width: 200,
        height: 200,
        borderRadius: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fullscreenImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    image_container: {

        width: '40%',
        // backgroundColor: 'grey',
        padding: 15,
    },
    flatlist_container: {
        // backgroundColor: 'red',
    },
    video_item: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',

    },
    video: {
        // width: '100%',
        // height: 190,
        borderRadius: 20,
        width: '100%',
        aspectRatio: 1 / 1,
        // margin: 10,
        // flex: 1,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    itemContainer: {
        width: '48%',  // Ensure two items fit in a row
        // backgroundColor: 'grey',  // Example styling
        marginVertical: 10,
    },
    audio_btn: {
        width: '100%',  // Ensure two items fit in a row
        backgroundColor: 'grey',  // Example styling
        marginVertical: 10,
    },
    audio_btn_container: {
        width: '100%',  // Ensure two items fit in a row
        backgroundColor: 'grey',  // Example styling
        borderRadius: 20,
        marginVertical: 10,
    },
});

export default CompetitionListScreen;