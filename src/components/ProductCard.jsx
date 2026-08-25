import React from 'react';

export default function ProductCard({ product, isSelected, onToggleSelect }) {
  const isBulkUnit = (product.unit === 'per Bundle' || product.unit === 'per Dozen') && product.bundlePieces > 0;
  const perPieceRate = isBulkUnit ? Math.round(product.baseRate / product.bundlePieces) : 0;

  return (
    <div className={`product-card ${isSelected ? 'selected' : ''}`}>
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
      </div>

      <div className="card-body">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-details">{product.description || ''}</p>

        <div className="purchase-rule-box">
          <i className="fa-solid fa-circle-info"></i>
          <span>
            {product.minOrderNotice ||
              (isBulkUnit
                ? `Must be purchased per ${product.unit.replace('per ', '')} (${product.bundlePieces} Pcs)`
                : 'Available for single piece purchase')}
          </span>
        </div>

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

        <button type="button" className="btn-select-item" onClick={() => onToggleSelect(product.id)}>
          <i className={`fa-solid ${isSelected ? 'fa-circle-check' : 'fa-circle-plus'}`}></i>
          <span>{isSelected ? 'Selected' : 'Select Item'}</span>
        </button>
      </div>
    </div>
  );
}
