import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDwKeeNuPumGC2Sjbbj7AS-Qw24ORmYAXU",
  authDomain: "taskboard-18bab.firebaseapp.com",
  projectId: "taskboard-18bab",
  storageBucket: "taskboard-18bab.firebasestorage.app",
  messagingSenderId: "1056179242678",
  appId: "1:1056179242678:web:b38afd37aebe47e1438817"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
