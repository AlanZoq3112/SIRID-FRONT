// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage'
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5irBFnKEHX0yP1gzxDe9aWvSzpNAcugk",
  authDomain: "imagenessirid.firebaseapp.com",
  projectId: "imagenessirid",
  storageBucket: "imagenessirid.appspot.com",
  messagingSenderId: "94551123740",
  appId: "1:94551123740:web:84ae7fd7bb5bf29bbd3cd9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)