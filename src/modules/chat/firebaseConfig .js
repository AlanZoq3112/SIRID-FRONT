import { initializeApp } from "firebase/app";
import {getAuth}from "firebase/auth"
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyD5TN3qulII5RMXwJRkhCNzs8L8jKBS3Wk",
  authDomain: "siridchat.firebaseapp.com",
  projectId: "siridchat",
  storageBucket: "siridchat.appspot.com",
  messagingSenderId: "40914305724",
  appId: "1:40914305724:web:76deef7be34adae22a86b9"
};

const app = initializeApp(firebaseConfig);
export const auth =getAuth(app);
export const db=getFirestore(app)