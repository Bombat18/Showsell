
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxRlBZFOD9TJbzK3o2QP66kR-ccPPQBy8",
  authDomain: "product-crud-app-976b0.firebaseapp.com",
  projectId: "product-crud-app-976b0",
  storageBucket: "product-crud-app-976b0.firebasestorage.app",
  messagingSenderId: "764747545101",
  appId: "1:764747545101:web:4af52b8e9d400b6015b344"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);