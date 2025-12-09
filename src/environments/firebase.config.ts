// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCYCxnkC8-LftaF-cn-zzZ3W62ZZwELpR8",
  authDomain: "wm-planner.firebaseapp.com",
  projectId: "wm-planner",
  storageBucket: "wm-planner.firebasestorage.app",
  messagingSenderId: "865246582332",
  appId: "1:865246582332:web:b5a0856b2003eded83d539",
  measurementId: "G-960BMJYZD9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
