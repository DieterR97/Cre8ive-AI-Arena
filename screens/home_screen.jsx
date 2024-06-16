import React, { useLayoutEffect, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Button } from 'react-native';
import { handleSignOut } from '../services/authService';
import { customHeaderOptions } from '../utilities/headerUtils.js';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const HomeScreen = ({ navigation }) => {
    const [competitions, setCompetitions] = useState([]);

    // useLayoutEffect(() => {
    //     navigation.setOptions(customHeaderOptions);
    // }, [navigation]);


    useLayoutEffect(() => {
        navigation.setOptions({
            ...customHeaderOptions,
            headerRight: () => (
                <Button
                    onPress={handleLogout}
                    title="Sign Out"
                    color="#000"
                />
            ),
        });
    }, [navigation]);


    useEffect(() => {
        const fetchCompetitions = async () => {
            const firestore = getFirestore();
            const competitionsCollection = collection(firestore, 'competitions');
            const competitionsSnapshot = await getDocs(competitionsCollection);
            const competitionsList = competitionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCompetitions(competitionsList);
        };

        fetchCompetitions();
    }, []);

    const checkAndUpdateCompetitionStatus = async (competition) => {
        const firestore = getFirestore();
        if (new Date() > new Date(competition.endDate.seconds * 1000)) {
            const submissionsCollection = collection(firestore, `submissions/${competition.competitionType.toLowerCase()}/${competition.competitionType.toLowerCase()}`);
            const submissionsSnapshot = await getDocs(submissionsCollection);
            let highestVoteDoc = null;

            if (!submissionsSnapshot.empty) {
                submissionsSnapshot.forEach((doc) => {
                    if (!highestVoteDoc || doc.data().voteCount > highestVoteDoc.data().voteCount) {
                        highestVoteDoc = doc;
                    }
                });

                if (highestVoteDoc) {
                    await updateDoc(doc(firestore, 'competitions', competition.id), {
                        winner: highestVoteDoc.id,
                        status: 'closed'
                    });
                }
            }
        }
    };

    const handlePress = async (competition) => {
        await checkAndUpdateCompetitionStatus(competition);

        if (new Date() > new Date(competition.endDate.seconds * 1000)) {
            navigation.navigate('Winners', { screen: 'WinnersScreen', params: { winnerId: competition.winner } });
        } else {
            navigation.navigate('CompetitionList', { category: competition.competitionType.toLowerCase() });
        }
    };



    const handleLogout = async () => {
        await handleSignOut();
        navigation.replace('LoginScreen'); // Navigate back to LoginScreen after sign out
    };

    return (
        <View style={styles.container}>
            <View style={styles.competitionsContainer}>
                {competitions.map((competition) => (
                    <TouchableOpacity
                        key={competition.id}
                        style={styles.competitionButton}
                        onPress={() => handlePress(competition)}
                    >
                        {competition.competitionType === 'Image' ? (
                            <ImageBackground
                                source={require('../assets/bg/image_bg.jpeg')}
                                style={styles.imageBackground}
                                imageStyle={styles.imageStyle}
                            />
                        ) : competition.competitionType === 'Video' ? (
                            <ImageBackground
                                source={require('../assets/bg/video_bg.png')}
                                style={styles.imageBackground}
                                imageStyle={styles.imageStyle}
                            />
                        ) : competition.competitionType === 'Audio' ? (
                            <ImageBackground
                                source={require('../assets/bg/audio_bg.png')}
                                style={styles.imageBackground}
                                imageStyle={styles.imageStyle}
                            />
                        ) : competition.competitionType === 'Animation' ? (
                            <ImageBackground
                                source={require('../assets/bg/animation_bg.png')}
                                style={styles.imageBackground}
                                imageStyle={styles.imageStyle}
                            />
                        ) : (
                            <></>
                        )}

                        <View style={styles.competitionTextView}>
                            <Text style={styles.competitionText}>{`Best AI-Generated ${competition.competitionType}`}</Text>
                        </View>

                        <View style={styles.endDateContainer}>
                            <Text style={styles.endDateText}>
                                {new Date() > new Date(competition.endDate.seconds * 1000) ? 'Competition Closed' : `Ends on: ${new Date(competition.endDate.seconds * 1000).toLocaleString()}`}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    competitionsContainer: {
        flex: 8,
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 20,
    },
    competitionButton: {
        width: '80%',
        flex: 1,
        backgroundColor: '#6200ea',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        position: 'relative',
    },
    competitionText: {
        color: '#000',
        fontSize: 24,
        fontWeight: '800',
    },
    competitionTextView: {
        color: '#000',
        fontSize: 18,
        fontWeight: '600',
        backgroundColor: 'rgba(27, 238, 252, 0.7)',
        padding: 8,
        borderRadius: 10,
    },
    endDateContainer: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderRadius: 5,
        paddingHorizontal: 8,
    },
    endDateText: {
        color: '#fff',
        fontSize: 17,
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
export default HomeScreen;
