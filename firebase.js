// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// TODO: Replace the following with your app's Firebase project configuration

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBU-2P7PIbvq_4_1CVfO6FyXtiKehDOl7I",
    authDomain: "cre8ive-ai-arena.firebaseapp.com",
    projectId: "cre8ive-ai-arena",
    storageBucket: "cre8ive-ai-arena.appspot.com",
    messagingSenderId: "8805631437",
    appId: "1:8805631437:web:e54d10c9fcdc5437787084"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

// export { auth };

// Initialize Firebase
// const app = initializeApp(firebaseConfig);

// TODO:Initialize Firebase Authentication and get a reference to the service

// export const auth = getAuth(app); // exporting our auth capabilities

// Initialize Firebase

// TODO: Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app)

const storage = getStorage(app);

export { auth, db, storage };