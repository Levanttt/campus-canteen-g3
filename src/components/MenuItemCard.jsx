import { canPlaceDemoOrder, formatPrice } from '../utils/orderUtils.js';
import StatusBadge from './StatusBadge.jsx';

export default function MenuItemCard({ menuItem, isSelected, onSelect }) {
  const isAvailable = canPlaceDemoOrder(menuItem);

  return (
    <button
      className={`record-card${isSelected ? ' selected' : ''}${!isAvailable ? ' sold-out' : ''}`}
      type="button"
      onClick={() => onSelect(menuItem.id)}
      aria-pressed={isSelected}
    >
      <span className="card-heading">
        <strong>{menuItem.name}</strong>
        <StatusBadge status={menuItem.availability} />
      </span>
      <span className="card-footer">
        <span>{menuItem.id}</span>
        <span>{formatPrice(menuItem.price)}</span>
      </span>
    </button>
  );
}