import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBjt2Ax8HgkhKjV1LNHWuGQZzaVWOoWeRk",
  authDomain: "e-commerce-fc4c2.firebaseapp.com",
  projectId: "e-commerce-fc4c2",
  storageBucket: "e-commerce-fc4c2.appspot.com",
  messagingSenderId: "175212011027",
  appId: "1:175212011027:web:e7c5514344cb7ada39e9e6",
  measurementId: "G-DMCQ88K5HZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };