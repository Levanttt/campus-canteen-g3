import { useEffect, useRef, useState } from 'react';
import NotificationToast from '../components/NotificationToast.jsx';
import OrderList from '../components/OrderList.jsx';
import { fetchMenu } from '../services/menuService.js';
import { resetDemoOrders, subscribeToOrders } from '../services/orderService.js';

export default function TenantPage() {
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);
  const [toast, setToast] = useState(null);
  const [connected, setConnected] = useState(false);
  const prevCountRef = useRef(0);

  useEffect(() => {
    fetchMenu().then(setMenu).catch(console.error);
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToOrders((newOrders) => {
      setConnected(true);

      if (newOrders.length > prevCountRef.current && prevCountRef.current !== 0) {
        const latest = newOrders[0];
        setToast(`Pesanan Baru Masuk: ${latest?.menuName || latest?.menuId || 'Item Menu'}`);
        setTimeout(() => setToast(null), 4000);
      }

      prevCountRef.current = newOrders.length;
      setOrders(newOrders);
    });

    return unsubscribe;
  }, []);

  async function handleReset() {
    try {
      const updatedMenu = await fetchMenu();
      setMenu(updatedMenu);
      await resetDemoOrders(updatedMenu);
      setToast('Antrean pesanan demo berhasil di-reset!');
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      console.error('Gagal me-reset antrean:', err);
      alert('Gagal me-reset antrean pesanan.');
    }
  }

  const pendingOrders = orders.filter((o) => o.status === 'NEW' || o.status === 'PREPARING');
  const doneOrders = orders.filter((o) => o.status === 'DONE' || o.status === 'READY');

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Tenant Dashboard</p>
          <h1>Dasbor Antrean Pesanan</h1>
          <p className="subtitle">
            {connected ? 'Terhubung — Sinkronisasi real-time aktif' : 'Menghubungkan ke server…'}
          </p>
        </div>
        <button className="secondary-button" type="button" onClick={handleReset}>
          Reset Antrean Demo
        </button>
      </header>

      {toast && <NotificationToast message={toast} />}

      <section className="overview-grid" aria-label="Ringkasan Antrean">
        <article className="summary-card">
          <p className="summary-label">Total Pesanan</p>
          <p className="summary-value">{orders.length}</p>
        </article>
        <article className="summary-card">
          <p className="summary-label">Menunggu / Diproses</p>
          <p className="summary-value">{pendingOrders.length}</p>
        </article>
        <article className="summary-card">
          <p className="summary-label">Selesai</p>
          <p className="summary-value">{doneOrders.length}</p>
        </article>
      </section>

      <section className="panel secondary-section" aria-labelledby="order-queue-heading">
        <div className="panel-heading">
          <h2 id="order-queue-heading">Daftar Antrean Masuk</h2>
          <span className="meta">{orders.length} total pesanan</span>
        </div>
        {orders.length === 0 ? (
          <div className="empty-state">Belum ada pesanan masuk saat ini.</div>
        ) : (
          <OrderList orders={orders} menu={menu} />
        )}
      </section>
    </main>
  );
}
