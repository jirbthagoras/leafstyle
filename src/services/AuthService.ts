import { auth, db } from "@/lib/firebase/config";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential} from "firebase/auth";
import Cookies from "js-cookie";
import {signOut} from "@firebase/auth";

export default async function saveCookie(userCredential: UserCredential) {
  Cookies.set("user", JSON.stringify(await userCredential.user.getIdToken()), {
    expires: 1,
    sameSite: "none",
    secure: true
  });
}

export const signUpUser = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const userRef = doc(db, "users", userCredential.user.uid); // Use UID as document ID
  await setDoc(userRef, {
    points: 0,
    lastUpdated: serverTimestamp(),
  });

  await saveCookie(userCredential);

  return userCredential.user;
};

export const loginUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);

  await saveCookie(userCredential);

  return userCredential.user;
};

export const logoutUser = async () => {
  Cookies.remove("user");
  await signOut(auth);
}