import { useEffect, useState } from 'react';
import MenuItemDetails from '../components/MenuItemDetails.jsx';
import MenuItemList from '../components/MenuItemList.jsx';
import { fetchMenu } from '../services/menuService.js';
import { createOrder } from '../services/orderService.js';
import { canPlaceDemoOrder } from '../utils/orderUtils.js';

export default function CustomerPage() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [orderNotification, setOrderNotification] = useState(null);

  useEffect(() => {
    loadMenu();
  }, []);

  async function loadMenu() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMenu();
      setMenu(data);
      setSelectedId(data[0]?.id ?? null);
    } catch (err) {
      console.error('Gagal memuat katalog menu:', err);
      setError('Gagal memuat data menu dari database.');
    } finally {
      setLoading(false);
    }
  }

  async function handlePlaceOrder(menuId) {
    const menuItem = menu.find((item) => item.id === menuId);

    if (!menuItem || !canPlaceDemoOrder(menuItem)) {
      alert('Transaksi ditolak: Item menu ini tidak tersedia.');
      return;
    }

    try {
      const payload = {
        menuId: menuItem.id,
        menuName: menuItem.name,
        price: menuItem.price,
        tenant: menuItem.tenant || 'Campus Kitchen',
        status: 'NEW',
        createdAt: new Date(),
      };

      await createOrder(payload);

      setOrderNotification(` Pesanan "${menuItem.name}" berhasil dibuat dan dikirim ke tenant!`);
      setTimeout(() => setOrderNotification(null), 4000);
    } catch (err) {
      console.error('Gagal memproses transaksi pesanan:', err);
      alert('Gagal mengirimkan pesanan ke database. Silakan coba lagi.');
    }
  }

  const selectedMenuItem = menu.find((item) => item.id === selectedId) ?? null;
  const availableCount = menu.filter((item) => item.availability === 'AVAILABLE').length;

  if (loading) {
    return (
      <main className="app-shell">
        <div className="empty-state">Memuat katalog menu dari database…</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="app-shell">
        <div className="empty-state" role="alert">{error}</div>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Campus Canteen</p>
          <h1>Campus Canteen Ordering</h1>
          <p className="subtitle">Pilih menu dan lakukan pemesanan langsung ke tenant.</p>
        </div>
        <button className="secondary-button" type="button" onClick={loadMenu}>
          Reset Menu Demo
        </button>
      </header>

      {orderNotification && (
        <p className="browser-note" role="status">
          {orderNotification}
        </p>
      )}

      <section className="overview-grid" aria-label="Ringkasan Menu">
        <article className="summary-card">
          <p className="summary-label">Total menu</p>
          <p className="summary-value">{menu.length}</p>
        </article>
        <article className="summary-card">
          <p className="summary-label">Menu tersedia</p>
          <p className="summary-value">{availableCount}</p>
        </article>
      </section>

      <section className="content-grid">
        <section className="panel" aria-labelledby="menu-list-heading">
          <h2 id="menu-list-heading">Daftar Menu</h2>
          <MenuItemList
            menu={menu}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </section>
        <aside className="panel" aria-label="Detail Menu yang Dipilih">
          <MenuItemDetails
            menuItem={selectedMenuItem}
            onPlaceOrder={handlePlaceOrder}
          />
        </aside>
      </section>
    </main>
  );
}