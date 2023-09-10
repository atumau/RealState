// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDGEAW2kCfpJAxyXfs42GczEKU5KUINrU0",
  authDomain: "house-market-7f784.firebaseapp.com",
  projectId: "house-market-7f784",
  storageBucket: "house-market-7f784.appspot.com",
  messagingSenderId: "639648980681",
  appId: "1:639648980681:web:07c4a069abeb96b78ff718",
  measurementId: "G-BEL7X6BL8M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();