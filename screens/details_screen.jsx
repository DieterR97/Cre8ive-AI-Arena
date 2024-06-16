import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, Image, StyleSheet, Modal, TouchableWithoutFeedback, ActivityIndicator, ImageBackground } from 'react-native';
import { Video } from 'expo-av';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { customHeaderOptions2 } from '../utilities/headerUtils2.js';

const DetailsScreen = ({ route, navigation }) => {
    const { item } = route.params;
    const [user, setUser] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isVideoLoading, setIsVideoLoading] = useState(true);

    useLayoutEffect(() => {
        navigation.setOptions(customHeaderOptions2);
    }, [navigation]);

    useEffect(() => {
        const fetchUserData = async () => {
            const userRef = doc(db, 'users', item.userId);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                setUser(userDoc.data());
            }
        };
        fetchUserData();
    }, [item.userId]);

    const handleFullScreen = () => {
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
    };

    const formatTimestamp = (timestamp) => {
        if (timestamp && timestamp.seconds) {
            const date = new Date(timestamp.seconds * 1000);
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        }
        return 'Invalid date';
    };

    return (
        <View style={styles.container}>
            {item.category === 'image' ? (
                <TouchableWithoutFeedback onPress={handleFullScreen}>
                    <Image source={{ uri: item.fileUrl }} style={styles.image} />
                </TouchableWithoutFeedback>
            ) : item.category === 'video' || item.category === 'animation' ? (
                <TouchableWithoutFeedback onPress={handleFullScreen}>
                    <Video
                        source={{ uri: item.fileUrl }}
                        rate={1.0}
                        volume={1.0}
                        isMuted={false}
                        resizeMode="cover"
                        style={styles.video}
                        onLoad={() => setIsVideoLoading(false)}
                        onError={() => setIsVideoLoading(false)}
                    />
                </TouchableWithoutFeedback>
            ) : (
                item.category === 'audio' ? (
                    <View style={styles.audioContainer}>
                        <ImageBackground
                            source={require('../assets/bg/aud_details.jpeg')}
                            style={styles.imageBackground}
                            imageStyle={styles.imageStyle}
                        />
                        <Text style={styles.aud_txt}>{item.title} (Audio)</Text>
                    </View>
                ) : null
            )}
            {isVideoLoading && item.category === 'video' && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#ffffff" />
                </View>
            )}
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
            <Text style={styles.status}>{item.status}</Text>
            {user && (
                <View style={styles.userContainer}>
                    <Text style={styles.userInfo}>Uploaded by: {user.name} {user.surname}</Text>
                    <Text style={styles.userEmail}>Email: {user.email}</Text>
                </View>
            )}

            <Modal visible={isModalVisible} transparent={true}>
                <TouchableWithoutFeedback onPress={handleModalClose}>
                    <View style={styles.modalContainer}>
                        {item.category === 'image' ? (
                            <Image source={{ uri: item.fileUrl }} style={styles.fullscreenMedia} resizeMode="contain" />
                        ) : item.category === 'video' || item.category === 'animation' ? (
                            <Video
                                source={{ uri: item.fileUrl }}
                                rate={1.0}
                                volume={1.0}
                                isMuted={false}
                                resizeMode="cover"
                                style={styles.fullscreenMedia}
                            />
                        ) : (
                            <Text>{item.title}</Text>
                        )}
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f5fcff',
    },
    image: {
        width: '100%',
        // height: 300,
        aspectRatio: 1 / 1,
        borderRadius: 10,
    },
    video: {
        width: '100%',
        height: 300,
        borderRadius: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 16,
        marginVertical: 10,
    },
    timestamp: {
        fontSize: 14,
        color: 'gray',
    },
    status: {
        fontSize: 14,
        color: 'red',
    },
    userContainer: {
        marginTop: 20,
    },
    userInfo: {
        fontSize: 18,
    },
    userEmail: {
        fontSize: 16,
        color: 'gray',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fullscreenMedia: {
        width: '100%',
        height: '100%',
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    audioContainer: {
        width: '100%',
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 10
    },
    aud_txt: {
        fontSize: 24,
        marginLeft: 140,
        fontWeight: '500'
    },
    imageBackground: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
    },
    imageStyle: {
        borderRadius: 10,
        position: 'absolute',
    },
});

export default DetailsScreen;
