import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, FlatList, Text, Image, ActivityIndicator, StyleSheet, TouchableWithoutFeedback, Pressable, TouchableOpacity, ImageBackground } from 'react-native';
import { Video } from 'expo-av'; // using Video from expo-av
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { customHeaderOptions } from '../utilities/headerUtils.js';
import { MaterialIcons } from 'react-native-vector-icons';

const CustomIcon = ({ name, focused, color, size = 280 }) => {
    return <MaterialIcons name={name} size={size} color={focused ? color : 'black'} />;
};

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const ExploreScreen = ({ navigation }) => {
    const [content, setContent] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useLayoutEffect(() => {
        navigation.setOptions(customHeaderOptions);
    }, [navigation]);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                setIsLoading(true);
                const allContent = [];
                const categories = ['image', 'video', 'audio', 'animation'];
                for (const category of categories) {
                    const querySnapshot = await getDocs(collection(db, `submissions/${category}/${category}`));
                    querySnapshot.forEach(doc => {
                        allContent.push({ id: doc.id, ...doc.data(), category });
                    });
                }
                const shuffledContent = shuffleArray(allContent);
                setContent(shuffledContent);
            } catch (error) {
                console.error('Error fetching content: ', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchContent();
    }, [navigation]);

    const handleItemPress = (item) => {
        navigation.navigate('Details', { item });
    };

    const renderItem = ({ item }) => {
        const randomBackground = Math.random() < 0.5
            ? require('../assets/bg/bg-grad-1.png')
            : require('../assets/bg/bg-grad-2.png');

        return (
            <View style={styles.itemContainer}>
                {item.competitionType === 'image' ? (
                    <TouchableOpacity onPress={() => handleItemPress(item)}>
                        <View>
                            <Image
                                source={{ uri: item.fileUrl }}
                                style={styles.image}
                            />
                        </View>
                    </TouchableOpacity>
                ) : item.competitionType === 'video' || item.competitionType === 'animation' ? (
                    <Pressable onPress={() => handleItemPress(item)}>
                        <View>
                            <Video
                                source={{ uri: item.fileUrl }}
                                rate={1.0}
                                volume={1.0}
                                isMuted={true}
                                resizeMode="cover"
                                shouldPlay
                                isLooping
                                style={styles.video}
                            />
                        </View>
                    </Pressable>
                ) : item.competitionType === 'audio' ? (
                    <TouchableOpacity onPress={() => handleItemPress(item)}>
                        <View style={styles.audioContainer}>
                            <ImageBackground
                                source={randomBackground}
                                style={styles.imageBackground}
                                imageStyle={styles.imageStyle}
                            />
                            <CustomIcon name="multitrack-audio" color={'#6200ea'} />
                            <Text style={styles.aud_txt}>(Audio)</Text>
                        </View>
                    </TouchableOpacity>
                ) : (
                    <Text>{item.title}</Text>
                )}
                <Text>{item.title} - {item.description}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#6200ea" />
                </View>
            ) : (
                <FlatList
                    data={content}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        backgroundColor: '#f5fcff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemContainer: {
        marginVertical: 10,
        alignItems: 'center',
    },
    image: {
        width: 400,
        height: 400,
        borderRadius: 20,
    },
    video: {
        width: 400,
        height: 400,
        borderRadius: 20,
    },
    audioContainer: {
        width: 400,
        height: 400,
        justifyContent: 'center',
        alignItems: 'center',
        background: `linear-gradient(115deg, #fa8bff, #2bd2ff, #2bff88)`, // Updated with backtick for template literal.
        borderRadius: 20,
        padding: 10
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
    aud_txt: {
        fontWeight: '400',
        fontSize: 20,
    },
});

export default ExploreScreen;
