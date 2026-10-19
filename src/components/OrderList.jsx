import StatusBadge from './StatusBadge.jsx';

function resolveMenuName(order, menu) {
  if (order.menuName) return order.menuName;
  const found = menu.find((item) => item.id === order.menuId);
  return found?.name ?? 'Menu Kantin';
}

function formatOrderTime(createdAt) {
  if (!createdAt) return '';
  const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

export default function OrderList({ orders, menu = [] }) {
  if (orders.length === 0) {
    return <div className="empty-state">Belum ada pesanan yang tercatat.</div>;
  }

  return (
    <ul className="secondary-list" aria-label="Daftar antrean pesanan">
      {orders.map((order) => (
        <li className="secondary-row" key={order.id}>
          <div>
            <p>
              <strong>{resolveMenuName(order, menu)}</strong>
            </p>
            <span className="meta">
              <span>{order.menuId}</span>
              {order.createdAt && <span> · {formatOrderTime(order.createdAt)}</span>}
            </span>
          </div>
          <StatusBadge status={order.status} />
        </li>
      ))}
    </ul>
  );
}
