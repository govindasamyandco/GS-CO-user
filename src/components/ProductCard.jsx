import React from 'react';

export default function ProductCard({ product, isSelected, onToggleSelect }) {
  const isBulkUnit = (product.unit === 'per Bundle' || product.unit === 'per Dozen') && product.bundlePieces > 0;
  const perPieceRate = isBulkUnit ? Math.round(product.baseRate / product.bundlePieces) : 0;
  const seasonNotice = product.seasonNotice || 'Price may differ based on the season item or the stock quantity';
  const isDisabled = !!product.isDisabled;

  return (
    <div
      className={`product-card ${isSelected ? 'selected' : ''}`}
      style={{
        opacity: isDisabled ? 0.75 : 1,
        border: isDisabled ? '1.5px dashed #cbd5e1' : undefined
      }}
    >
      {/* Selection Checkmark Badge */}
      <div className="select-checkbox-badge" title="Item Selected">
        <i className="fa-solid fa-check"></i>
      </div>

      <div className="card-img-wrapper">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="card-img"
          onError={(e) => { e.target.src = '/public/assets/logo.jpg'; }}
        />
        <span className="category-tag">{product.category}</span>
        {isBulkUnit && (
          <span className="bundle-badge">
            <i className="fa-solid fa-boxes-packing"></i> {product.bundlePieces} Pcs / {product.unit.replace('per ', '')}
          </span>
        )}
        {isDisabled && (
          <span style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: '#ef4444',
            color: '#ffffff',
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: '0.35rem 0.75rem',
            borderRadius: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            zIndex: 5
          }}>
            <i className="fa-solid fa-ban"></i> Unavailable
          </span>
        )}
      </div>

      <div className="card-body">
        <h3 className="product-title" style={{ color: isDisabled ? '#64748b' : undefined }}>
          {product.title}
        </h3>
        <p className="product-details">{product.description || ''}</p>

        {/* Purchase Rule Notice */}
        <div className="purchase-rule-box">
          <i className="fa-solid fa-circle-info"></i>
          <span>
            {product.minOrderNotice ||
              (isBulkUnit
                ? `Must be purchased per ${product.unit.replace('per ', '')} (${product.bundlePieces} Pcs)`
                : 'Available for single piece purchase')}
          </span>
        </div>

        {/* Prominent Seasonal / Stock Price Notice */}
        <div className="season-stock-notice-badge">
          <i className="fa-solid fa-tags"></i>
          <span>{seasonNotice}</span>
        </div>

        {/* Stock Availability */}
        {product.stockQty !== undefined && (
          <div className="stock-info-row">
            <i className="fa-solid fa-warehouse"></i>
            <span>Available Stock: <strong>{product.stockQty} Bundles</strong></span>
          </div>
        )}

        <div className="price-box">
          <div>
            <span className="rate-label">Wholesale Rate</span>
            <div className="rate-value">
              ₹{product.baseRate ? product.baseRate.toLocaleString('en-IN') : 0}
              <span className="unit-label">/{product.unit ? product.unit.replace('per ', '') : ''}</span>
            </div>
            {isBulkUnit && (
              <div className="piece-rate-hint">(~ ₹{perPieceRate.toLocaleString('en-IN')} / pc)</div>
            )}
          </div>
        </div>

        {isDisabled ? (
          <button
            type="button"
            className="btn-select-item"
            disabled
            style={{
              background: '#f1f5f9',
              color: '#94a3b8',
              borderColor: '#cbd5e1',
              cursor: 'not-allowed'
            }}
          >
            <i className="fa-solid fa-ban"></i>
            <span>Currently Unavailable</span>
          </button>
        ) : (
          <button type="button" className="btn-select-item" onClick={() => onToggleSelect(product.id)}>
            <i className={`fa-solid ${isSelected ? 'fa-circle-check' : 'fa-circle-plus'}`}></i>
            <span>{isSelected ? 'Selected' : 'Select Item'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
