// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBBZ8lmKHJRO6je6zhZt-lbGCgEAInlPK0",
  authDomain: "greenfinity-c6f2c.firebaseapp.com",
  projectId: "greenfinity-c6f2c",
  storageBucket: "greenfinity-c6f2c.firebasestorage.app",
  messagingSenderId: "22182758180",
  appId: "1:22182758180:web:fa3c26af740e7f3e8295b1",
  measurementId: "G-0PXBWG4QZQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
