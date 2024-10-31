import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbGacRsz1twEhpAspPq1yXmJydU0lqF1Y",
  authDomain: "fir-loginsignup-e8746.firebaseapp.com",
  projectId: "fir-loginsignup-e8746",
  storageBucket: "fir-loginsignup-e8746.appspot.com",
  messagingSenderId: "775108009649",
  appId: "1:775108009649:web:417c5e9729f771b1c88c90"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
