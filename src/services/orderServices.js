import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase.js';

/**
 * US-2.3 — Mengirimkan (POST) data transaksi pesanan baru ke koleksi "orders" di Firestore.
 * @param {Object} orderData Payload pesanan (menuId, menuName, price, status, createdAt)
 * @returns {Promise<string>} ID dokumen pesanan yang berhasil dibuat di Firestore
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