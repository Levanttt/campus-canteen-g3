import { useEffect, useState } from 'react';
import MenuItemDetails from '../components/MenuItemDetails.jsx';
import MenuItemList from '../components/MenuItemList.jsx';
import { fetchMenu } from '../services/menuService.js';

export default function CustomerPage() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

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
      console.error('Gagal mengambil data menu dari Firestore:', err);
      setError('Gagal memuat katalog menu dari database eksternal. Periksa konfigurasi Firebase atau koneksi internet.');
    } finally {
      setLoading(false);
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
          <p className="subtitle">
            Katalog menu resmi kantin kampus yang terhubung dengan database eksternal.
          </p>
        </div>
        <button className="secondary-button" type="button" onClick={loadMenu}>
          Reset Demo
        </button>
      </header>

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
          <MenuItemDetails menuItem={selectedMenuItem} />
        </aside>
      </section>
    </main>
  );
}
