//All of our Firestore Functionality
import { collection, addDoc, getDocs, query, orderBy, where, doc, setDoc } from "firebase/firestore";
// TODO: Create Firebase Auth Functions
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../firebase";

import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';

export const handleregister = async (item) => {
    try {
        const { name, surname, email, password } = item;

        if (!name || !surname || !email || !password) {
            throw new Error("All fields (name, surname, email, password) are required");
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
            name: name,
            surname: surname,
            email: email
        });

        console.log("Signed up user: " + user.email);
        return true;
    } catch (e) {
        console.error("Error adding user: ", e.message);
        return false;
    }
};

export const fetchSubmissionsByCategory = async (category) => {
    try {
        const querySnapshot = await getDocs(query(collection(db, "submissions"), where("category", "==", category)));
        const submissions = [];
        querySnapshot.forEach((doc) => {
            submissions.push({
                id: doc.id,
                ...doc.data()
            });
        });
        return submissions;
    } catch (error) {
        console.error("Error fetching submissions: ", error);
        return [];
    }
};


// export const getDocu = async () => {
//     const result = await DocumentPicker.getDocumentAsync({
//         type: 'audio/*',
//         // copyToCacheDirectory: false,
//     });
// }