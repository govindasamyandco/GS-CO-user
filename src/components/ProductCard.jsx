import React from 'react';

export default function ProductCard({ product, isSelected, onToggleSelect }) {
  const isBulkUnit = (product.unit === 'per Bundle' || product.unit === 'per Dozen') && product.bundlePieces > 0;
  const perPieceRate = isBulkUnit ? Math.round(product.baseRate / product.bundlePieces) : 0;
  const seasonNotice = product.seasonNotice || 'Price may differ based on the season item or the stock quantity';
  const isDisabled = !!product.isDisabled;

  return (
    <div
      className={`product-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'product-card-disabled' : ''}`}
    >
      {/* Top Header Row of the Card */}
      <div className="card-top-bar">
        <span className="card-category-badge">{product.category || 'Panipat Mat'}</span>
        {isBulkUnit && (
          <span className="card-bundle-pill">
            {product.bundlePieces} Pcs/{product.unit.replace('per ', '')}
          </span>
        )}
      </div>

      {/* Main Split Body: Left Logo/Photo Box, Right Details */}
      <div className="card-main-split">
        <div className="card-image-box">
          <img
            src={product.imageUrl || '/assets/logo.jpg'}
            alt={product.title}
            className="card-product-img"
            onError={(e) => { e.target.src = '/assets/logo.jpg'; }}
          />
        </div>

        <div className="card-info-col">
          <h3 className="card-title">{product.title}</h3>
          <p className="card-desc">{product.description || 'High quality woven durable mat.'}</p>

          <div className="card-tags-list">
            {/* Tag 1: Purchase Rule Tag */}
            <div className="card-tag card-tag-yellow">
              <i className="fa-solid fa-box-open"></i>
              <span>{product.minOrderNotice || (isBulkUnit ? 'Purchased per full Bundle only' : 'Available for single piece purchase')}</span>
            </div>

            {/* Tag 2: Seasonal / Stock Price Notice Tag */}
            <div className="card-tag card-tag-yellow">
              <i className="fa-solid fa-circle-info"></i>
              <span>{seasonNotice}</span>
            </div>
          </div>

          {/* Available Stock Tag */}
          <div className="card-stock-row">
            <i className="fa-solid fa-warehouse"></i>
            <span>Available Stock: <strong>{product.stockQty !== undefined ? `${product.stockQty} Bundles` : 'In Stock'}</strong></span>
          </div>
        </div>
      </div>

      {/* Bottom Pricing & Selection Action Row */}
      <div className="card-footer-row">
        <div className="card-rate-col">
          <span className="card-rate-label">WHOLESALE RATE</span>
          <div className="card-rate-price">
            ₹{product.baseRate ? product.baseRate.toLocaleString('en-IN') : 0}
            <span className="card-rate-unit">/{product.unit ? product.unit.replace('per ', '') : 'Bundle'}</span>
          </div>
          {isBulkUnit && (
            <div className="card-per-pc-hint">(~ ₹{perPieceRate.toLocaleString('en-IN')}/pc)</div>
          )}
        </div>

        <div className="card-action-col">
          {isDisabled ? (
            <button type="button" className="btn-select-pill btn-disabled" disabled>
              <i className="fa-solid fa-ban"></i>
              <span>Unavailable</span>
            </button>
          ) : (
            <button
              type="button"
              className={`btn-select-pill ${isSelected ? 'btn-selected' : ''}`}
              onClick={() => onToggleSelect(product.id)}
            >
              <i className={`fa-solid ${isSelected ? 'fa-check' : 'fa-plus'}`}></i>
              <span>{isSelected ? 'Selected' : 'Select Item'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
