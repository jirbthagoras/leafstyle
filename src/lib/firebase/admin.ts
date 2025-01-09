import { doc, getDoc, getFirestore } from 'firebase/firestore';

export const checkIsAdmin = async (uid: string): Promise<boolean> => {
  try {
    const db = getFirestore();
    const userDoc = await getDoc(doc(db, 'users', uid));
    const isAdmin = userDoc.data()?.isAdmin === true;
    console.log('Admin check for uid:', uid, 'Result:', isAdmin);
    return isAdmin;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}; 