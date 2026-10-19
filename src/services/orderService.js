import { addDoc, collection, doc, getDocs, onSnapshot, orderBy, query, writeBatch } from 'firebase/firestore';
import { db } from '../firebase.js';

/**
 * @param {Object} orderData 
 * @returns {Promise<string>} 
 */
export async function createOrder(orderData) {
  // Validasi payload sebelum dikirim
  if (!orderData.menuId) {
    throw new Error('Validasi gagal: ID Menu wajib disertakan.');
  }

  const payload = {
    ...orderData,
    status: orderData.status || 'NEW',
    createdAt: orderData.createdAt || new Date(),
  };

  const docRef = await addDoc(collection(db, 'orders'), payload);
  return docRef.id;
}

/**
 * @param {(orders: Array) => void} callback 
 * @returns {() => void} 
 */
export function subscribeToOrders(callback) {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(orders);
  });
}

export async function resetDemoOrders(menuList = []) {
  const snapshot = await getDocs(collection(db, 'orders'));
  const batch = writeBatch(db);
  snapshot.docs.forEach((d) => {
    batch.delete(doc(db, 'orders', d.id));
  });
  await batch.commit();

  if (menuList.length > 0) {
    const firstItem = menuList[0];
    const secondItem = menuList[1] || firstItem;

    await addDoc(collection(db, 'orders'), {
      menuId: firstItem.id,
      menuName: firstItem.name,
      status: 'PREPARING',
      createdAt: new Date(Date.now() - 5 * 60 * 1000),
    });

    if (menuList.length > 1) {
      await addDoc(collection(db, 'orders'), {
        menuId: secondItem.id,
        menuName: secondItem.name,
        status: 'READY',
        createdAt: new Date(Date.now() - 2 * 60 * 1000),
      });
    }
  }
}
