import React from 'react';

export default function FloatingBar({ selectedCount, grandTotal, hasAnyHiddenPrice = false, onOpenOrderLayer }) {
  if (selectedCount === 0) return null;

  return (
    <div className="floating-order-bar">
      <button type="button" className="floating-order-btn" onClick={onOpenOrderLayer}>
        <i className="fa-solid fa-file-invoice"></i>
        <span>View Order Form ({selectedCount} {selectedCount === 1 ? 'Item' : 'Items'})</span>
        <span className="floating-total-badge">
          {hasAnyHiddenPrice ? 'Price on Inquiry' : `Rs. ${grandTotal.toLocaleString('en-IN')}`}
        </span>
      </button>
    </div>
  );
}
