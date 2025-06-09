// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";             // ✅ Add this
import { getFirestore } from "firebase/firestore";   // ✅ And this
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_KyzgfbLuO8DEnLa3MxMxARM7E8odb7w",
  authDomain: "cake-customizer.firebaseapp.com",
  projectId: "cake-customizer",
  storageBucket: "cake-customizer.firebasestorage.app",
  messagingSenderId: "318477670570",
  appId: "1:318477670570:web:bef87e7d17cfe3ea0758d3",
  measurementId: "G-60E5PY1XW9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); // Optional
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
