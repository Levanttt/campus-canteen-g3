import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase.js';

/**
  @returns {Promise<Array>} 
 */
export async function fetchMenu() {
  const snapshot = await getDocs(collection(db, 'menu'));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
