import { useState } from 'react';
import { canPlaceDemoOrder, formatPrice } from '../utils/orderUtils.js';
import StatusBadge from './StatusBadge.jsx';

export default function MenuItemDetails({ menuItem, onPlaceOrder }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!menuItem) {
    return <div className="empty-state">Pilih salah satu item menu untuk melihat detailnya.</div>;
  }

  const isAvailable = canPlaceDemoOrder(menuItem);

  async function handleOrderClick() {
    if (!isAvailable || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onPlaceOrder(menuItem.id);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="panel-heading">
        <div>
          <p className="eyebrow">{menuItem.id}{menuItem.tenant ? ` · ${menuItem.tenant}` : ''}</p>
          <h2>{menuItem.name}</h2>
        </div>
        <StatusBadge status={menuItem.availability} />
      </div>

      <dl className="details-list">
        <dt>Tenant</dt>
        <dd>{menuItem.tenant || '—'}</dd>
        {menuItem.category && (
          <>
            <dt>Kategori</dt>
            <dd>{menuItem.category}</dd>
          </>
        )}
        <dt>Harga</dt>
        <dd>{formatPrice(menuItem.price)}</dd>
        <dt>Ketersediaan</dt>
        <dd>{isAvailable ? 'Tersedia' : 'Habis'}</dd>
      </dl>

      <button
        className="primary-button"
        type="button"
        onClick={handleOrderClick}
        disabled={!isAvailable || isSubmitting}
      >
        {isSubmitting
          ? 'Memproses Pesanan…'
          : isAvailable
            ? 'Konfirmasi & Pesan'
            : 'Habis (Stok Tidak Tersedia)'}
      </button>

      {!isAvailable && (
        <p className="helper-text error-text">
          Menu ini sedang habis dan tidak dapat dipesan saat ini.
        </p>
      )}
    </>
  );
}