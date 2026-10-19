import { useState } from 'react';
import { canPlaceDemoOrder, formatPrice } from '../utils/orderUtils.js';
import StatusBadge from './StatusBadge.jsx';

export default function MenuItemDetails({ menuItem, onPlaceOrder }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!menuItem) {
    return <div className="empty-state">Pilih salah satu item menu untuk melihat detailnya.</div>;
  }

  const canOrder = canPlaceDemoOrder(menuItem);

  async function handleOrderClick() {
    if (!canOrder || isSubmitting) return;

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
        <dd>{menuItem.availability?.replaceAll('_', ' ') ?? '—'}</dd>
      </dl>

      <button
        className="primary-button"
        type="button"
        onClick={handleOrderClick}
        disabled={!canOrder || isSubmitting}
      >
        {isSubmitting ? 'Memproses Pesanan…' : canOrder ? 'Konfirmasi & Pesan' : 'Habis'}
      </button>

      {!canOrder && (
        <p className="helper-text">Menu ini sedang tidak tersedia untuk dipesan.</p>
      )}
    </>
  );
}