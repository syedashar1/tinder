import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCVzgYQaXL7n1Tj5_6V4RY3awvj3yGVY9g",
  authDomain: "my-tinder-native.firebaseapp.com",
  projectId: "my-tinder-native",
  storageBucket: "my-tinder-native.appspot.com",
  messagingSenderId: "49886141206",
  appId: "1:49886141206:web:e6af1c9bb41bbc0e3f8e37"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth()
const db = getFirestore()
const storage = getStorage();

export {auth, db, storage}