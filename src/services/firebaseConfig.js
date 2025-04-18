import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDwK3TxD_9p6YybHRwW0HlT_ZKQpcxkMAY",
  authDomain: "project-manager-a9e52.firebaseapp.com",
  projectId: "project-manager-a9e52",
  storageBucket: "project-manager-a9e52.firebasestorage.app",
  messagingSenderId: "358020207718",
  appId: "1:358020207718:web:415be1c3af2d2f235e49a7",
  measurementId: "G-BPYW86YZQ9"
};




const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // Important pour Firestore