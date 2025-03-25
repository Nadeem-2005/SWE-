import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDzJwCoodYZgHAAbHZLZkcSeqYX5PpzI_Q",
  authDomain: "connect-plus-293bd.firebaseapp.com",
  projectId: "connect-plus-293bd",
  storageBucket: "connect-plus-293bd.firebasestorage.app",
  messagingSenderId: "155176521644",
  appId: "1:155176521644:web:fdb8d04a2ca99ce9717409",
  measurementId: "G-80P40MDSG8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

