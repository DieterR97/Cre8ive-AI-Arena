import { useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as MediaLibrary from 'expo-media-library';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Video } from 'expo-av'; // Import Video from expo-av for video rendering

function SubmissionScreen({ navigation }) {

    const route = useRoute();
    const { category } = route.params;

    // Handle undefined category
    if (!category) {
        navigation.goBack();
        return null;
    }

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [voteCount, setVoteCount] = useState(0);
    const [fileUri, setFileUri] = useState(null);
    const [loading, setLoading] = useState(false);
    const storage = getStorage();
    const firestore = getFirestore();
    const auth = getAuth();

    const handleTitleChange = text => {
        setTitle(text);
    };

    const handleDescriptionChange = text => {
        setDescription(text);
    };

    const pickFile = async () => {
        let mediaType;

        if (category === 'image') {
            mediaType = ImagePicker.MediaTypeOptions.Images;

            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Error', 'Permission to access media library is required');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: mediaType,
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled) {
                const fileUri = result.assets[0].uri;
                setFileUri(fileUri);
            } else {
                console.log("No file was selected");
            }

        } else if (category === 'video') {
            mediaType = ImagePicker.MediaTypeOptions.Videos;

            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Error', 'Permission to access media library is required');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: mediaType,
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled) {
                const fileUri = result.assets[0].uri;
                setFileUri(fileUri);
            } else {
                console.log("No file was selected");
            }

        } else if (category === 'audio') {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'audio/*',
                copyToCacheDirectory: true,
            });

            if (!result.canceled) {
                const fileUri = result.uri;
                setFileUri(fileUri);
            } else {
                console.log("No file was selected");
            }

        } else if (category === 'animation') {
            mediaType = ImagePicker.MediaTypeOptions.Videos; // Assuming animations are video files

            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Error', 'Permission to access media library is required');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: mediaType,
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled) {
                const fileUri = result.assets[0].uri;
                setFileUri(fileUri);
            } else {
                console.log("No file was selected");
            }
        }
    };

    const submitEntry = async () => {
        if (!fileUri || !title || !description) {
            Alert.alert('Error', 'All fields are required');
            return;
        }

        try {
            setLoading(true);
            const userId = auth.currentUser.uid;
            const fileName = fileUri.split('/').pop();
            const storageRef = ref(storage, `${category}/${fileName}`);
            const response = await fetch(fileUri);
            const blob = await response.blob();

            await uploadBytes(storageRef, blob);
            const fileUrl = await getDownloadURL(storageRef);

            if (!category) {
                Alert.alert('Error', 'Competition category is required');
                return;
            }

            await addDoc(collection(firestore, `submissions/${category}/${category}`), {
                userId,
                competitionType: category,
                title,
                description,
                voteCount,
                fileUrl,
                timestamp: new Date(),
                status: 'pending'
            });

            setLoading(false);
            Alert.alert('Success', 'Submission uploaded successfully');

            navigation.navigate('CompetitionList', { category: category });
            navigation.goBack();

        } catch (error) {
            setLoading(false);
            Alert.alert('Error', error.message);
        }
    };

    const renderSelectedFile = () => {
        if (category === 'image' && fileUri) {
            return <Image source={{ uri: fileUri }} style={styles.media} />;
        }

        if ((category === 'video' || category === 'animation') && fileUri) {
            return <Video source={{ uri: fileUri }} style={styles.media} useNativeControls resizeMode="contain" />;
        }

        if (category === 'audio' && fileUri) {
            return <Text>Audio file selected: {fileUri.split('/').pop()}</Text>;
        }

        return (
            <View style={styles.noFileContainer}>
                <Text style={styles.noFileText}>No file selected.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Submit Your Entry</Text>
            <TextInput
                style={styles.input}
                placeholder="Title"
                value={title}
                onChangeText={handleTitleChange}
            />
            <TextInput
                style={styles.input}
                placeholder="Description"
                value={description}
                onChangeText={handleDescriptionChange}
            />
            <View style={styles.buttonContainer}>
                <Button title="Pick a file" onPress={pickFile} color="#4CAF50" />
            </View>
            {renderSelectedFile()}
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            <View style={styles.buttonContainer}>
                <Button title="Submit" onPress={submitEntry} disabled={loading} color="#2196F3" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginVertical: 10,
        padding: 10,
    },
    media: {
        width: '100%',
        // height: 200,
        aspectRatio: 1 / 1,
        marginVertical: 10,
    },
    buttonContainer: {
        marginVertical: 10,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    noFileContainer: {
        alignItems: 'center',
        marginVertical: 40,
    },
    noFileText: {
        fontSize: 16,
    },
});

export default SubmissionScreen;
