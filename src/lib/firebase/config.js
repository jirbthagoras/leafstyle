// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyBBZ8lmKHJRO6je6zhZt-lbGCgEAInlPK0",
    authDomain: "greenfinity-c6f2c.firebaseapp.com",
    projectId: "greenfinity-c6f2c",
    storageBucket: "greenfinity-c6f2c.firebasestorage.app",
    messagingSenderId: "22182758180",
    appId: "1:22182758180:web:fa3c26af740e7f3e8295b1",
    measurementId: "G-0PXBWG4QZQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);

export { auth };