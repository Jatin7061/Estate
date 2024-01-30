// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "mern-estate-64e35.firebaseapp.com",
  projectId: "mern-estate-64e35",
  storageBucket: "mern-estate-64e35.appspot.com",
  messagingSenderId: "477628479028",
  appId: "1:477628479028:web:67bb41e0486e1e52d4fc61"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);