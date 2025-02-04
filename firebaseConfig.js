// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore";

// TODO: Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjw8SnUb60YcqM0GKDkvGMxohvkCqwQ2Y",
  authDomain: "cars-753c4.firebaseapp.com",
  projectId: "cars-753c4",
  storageBucket: "cars-753c4.appspot.com",
  messagingSenderId: "598212920243",
  appId: "1:598212920243:web:f58548e5e896a703e1c1c6",
  measurementId: "G-3P5EQT0CJQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Services (database, auth, etc)
const db = getFirestore(app);
const auth = getAuth(app)

export {db, auth}