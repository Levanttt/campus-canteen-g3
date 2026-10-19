/**
 * @param {Object} menuItem 
 * @returns {boolean} 
 */
export function canPlaceDemoOrder(menuItem) {
  if (!menuItem) return false;
  if (menuItem.availability === 'SOLD_OUT') return false;
  return menuItem.availability === 'AVAILABLE';
}

export function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price || 0);
}

export function getMenuName(menu, menuId) {
  return menu.find((item) => item.id === menuId)?.name ?? 'Menu Kantin';
}