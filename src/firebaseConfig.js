import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDwK3TxD_9p6YyBHRwW0HLZKQpcxkMAY",
  authDomain: "project-manager-a9e52.firebaseapp.com",
  projectId: "project-manager-a9e52",
  storageBucket: "project-manager-a9e52.appspot.com",
  messagingSenderId: "358020207718",
  appId: "1:358020207718:web:415be1c3af2df235e49a7",
  measurementId: "G-BPYW86YZQ9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
