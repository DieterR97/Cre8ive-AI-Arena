import React, { useEffect, useState, useLayoutEffect } from 'react';
import { StyleSheet, Text, View, Button, FlatList, Image, ActivityIndicator } from 'react-native';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';  // Ensure you have the firebase config setup
import { handleSignOut } from '../services/authService'; // Adjusted import to match your path
import { customHeaderOptions } from '../utilities/headerUtils.js';

const ProfileScreen = ({ navigation }) => {
  const [userSubmissions, setUserSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useLayoutEffect(() => {
    navigation.setOptions(customHeaderOptions);
  }, [navigation]);

  useEffect(() => {
    const fetchUserSubmissions = async () => {
      if (currentUser) {
        try {
          setLoading(true);
          const submissions = [];
          const categories = ['image', 'video', 'audio', 'animation'];
          for (const category of categories) {
            const q = query(
              collection(db, `submissions/${category}/${category}`),
              where("userId", "==", currentUser.uid)
            );
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(doc => {
              submissions.push({ id: doc.id, ...doc.data(), category });
            });
          }
          setUserSubmissions(submissions);
        } catch (error) {
          console.error('Error fetching user submissions: ', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserSubmissions();
  }, [currentUser]);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        {item.competitionType === 'image' && (
          <Image source={{ uri: item.fileUrl }} style={styles.image} />
        )}
        <Text>{item.title} - {item.description}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {currentUser ? (
        <>
          <Text style={styles.userEmail}>Logged in as: {currentUser.email}</Text>
          <Button title="Log Out" onPress={async () => {
            await handleSignOut();
            navigation.navigate('Login');
          }} />

          <Text style={styles.submissionsTitle}>Your Submissions</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <FlatList
              data={userSubmissions}
              keyExtractor={item => item.id}
              renderItem={renderItem}
            />
          )}
        </>
      ) : (
        <Text>You are not logged in</Text>
      )}
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  userEmail: {
    fontSize: 18,
    marginBottom: 10,
  },
  submissionsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  itemContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
  },
});
