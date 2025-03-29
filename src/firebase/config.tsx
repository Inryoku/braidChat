import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBbWhcS0wk6gOkSdwQm3DHZkE_VJ62CxfI",
  authDomain: "brainchat9.firebaseapp.com",
  projectId: "brainchat9",
  storageBucket: "brainchat9.firebasestorage.app",
  messagingSenderId: "679661615811",
  appId: "1:679661615811:web:3b267ef19d721ca041c076",
  measurementId: "G-CG3FMJ3XVW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
