import React, { useState } from 'react';

export default function ProductCard({ product, isSelected, onToggleSelect, onOpenDetail }) {
  const isBulkUnit = (product.unit === 'per Bundle' || product.unit === 'per Dozen') && product.bundlePieces > 0;
  const perPieceRate = isBulkUnit ? Math.round(product.baseRate / product.bundlePieces) : 0;
  const seasonNotice = product.seasonNotice || 'Price may differ based on the season item or the stock quantity';
  const isOutOfStock = product.inStock === false || product.stockStatus === 'OUT_OF_STOCK' || product.stockQty === 0;
  const isDisabled = Boolean(product.isDisabled);

  // Multi-image handling (Backward compatible fallback to single imageUrl)
  const imageList = Array.isArray(product.images) && product.images.length > 0
    ? product.images.filter(Boolean)
    : [product.imageUrl || '/assets/logo.jpg'];
  
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  const handleNextImg = (e) => {
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev + 1) % imageList.length);
  };

  const handlePrevImg = (e) => {
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  const isPriceHidden = Boolean(product.hidePrice);

  return (
    <div
      className={`product-card ${isSelected ? 'selected' : ''} ${isDisabled || isOutOfStock ? 'product-card-disabled' : ''}`}
    >
      {/* Top Header Row of the Card */}
      <div className="card-top-bar">
        <span className="card-category-badge">{product.category || 'Panipat Mat'}</span>
        {isBulkUnit && (
          <span className="card-bundle-pill">
            {product.bundlePieces} Pcs/{product.unit.replace('per ', '')}
          </span>
        )}
        {product.bundlesPerPack && (
          <span className="card-bundle-pill" style={{ background: '#e0f2fe', color: '#0369a1', borderColor: '#bae6fd' }}>
            <i className="fa-solid fa-cube" style={{ marginRight: '0.2rem' }}></i>
            1 Bale = {product.bundlesPerPack} {product.unit === 'per Piece' ? 'Pcs' : 'Bundles'}
          </span>
        )}
      </div>

      {/* Main Split Body: Left Photo Box with Gallery Controls, Right Details */}
      <div className="card-main-split">
        <div
          className="card-image-box"
          onClick={() => onOpenDetail && onOpenDetail(product)}
          title="Click to view large images & full specifications"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onOpenDetail && onOpenDetail(product); }}
          style={{ position: 'relative' }}
        >
          <img
            src={imageList[activeImgIdx] || '/assets/logo.jpg'}
            alt={`${product.title} photo ${activeImgIdx + 1}`}
            className="card-product-img"
            onError={(e) => { e.target.src = '/assets/logo.jpg'; }}
          />

          {/* Multi-Image Slider Arrows & Dots Indicator */}
          {imageList.length > 1 && (
            <>
              <button
                type="button"
                className="img-slider-arrow arrow-left"
                onClick={handlePrevImg}
                title="Previous photo"
                style={{
                  position: 'absolute',
                  left: '4px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(15, 23, 42, 0.65)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '0.7rem',
                  zIndex: 3
                }}
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>

              <button
                type="button"
                className="img-slider-arrow arrow-right"
                onClick={handleNextImg}
                title="Next photo"
                style={{
                  position: 'absolute',
                  right: '4px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(15, 23, 42, 0.65)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '0.7rem',
                  zIndex: 3
                }}
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>

              <div style={{
                position: 'absolute',
                bottom: '6px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '4px',
                zIndex: 3,
                background: 'rgba(15, 23, 42, 0.55)',
                padding: '2px 6px',
                borderRadius: '9999px'
              }}>
                {imageList.map((_, i) => (
                  <span
                    key={i}
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: i === activeImgIdx ? '#f59e0b' : '#cbd5e1',
                      transition: 'all 0.2s'
                    }}
                  />
                ))}
              </div>
            </>
          )}

          <div className="card-image-zoom-overlay">
            <i className="fa-solid fa-magnifying-glass-plus"></i>
            <span>{imageList.length > 1 ? `${imageList.length} Photos` : 'Zoom'}</span>
          </div>
        </div>

        <div className="card-info-col">
          <h3
            className="card-title card-title-clickable"
            onClick={() => onOpenDetail && onOpenDetail(product)}
            title="Click to view details"
          >
            {product.title}
          </h3>
          <p className="card-desc">{product.description || 'High quality woven durable mat.'}</p>

          <div className="card-tags-list">
            <div className="card-tag card-tag-yellow">
              <i className="fa-solid fa-box-open"></i>
              <span>{product.minOrderNotice || (isBulkUnit ? 'Purchased per full Bundle only' : 'Available for single piece purchase')}</span>
            </div>

            <div className="card-tag card-tag-yellow">
              <i className="fa-solid fa-circle-info"></i>
              <span>{seasonNotice}</span>
            </div>
          </div>

          <div className="card-stock-row" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <i className="fa-solid fa-warehouse"></i>
            <span>Stock Status: </span>
            <strong style={{
              fontSize: '0.82rem',
              fontWeight: 700,
              color: isOutOfStock ? '#b91c1c' : '#15803d'
            }}>
              {isOutOfStock ? 'Out of Stock' : 'In Stock'}
            </strong>
          </div>
        </div>
      </div>

      {/* Bottom Pricing & Selection Action Row */}
      <div className="card-footer-row">
        <div className="card-rate-col">
          <span className="card-rate-label">WHOLESALE RATE</span>
          {isPriceHidden ? (
            <div className="card-rate-price" style={{ color: '#0284c7', fontSize: '0.98rem', fontWeight: 800 }}>
              <i className="fa-solid fa-comment-dots" style={{ marginRight: '0.3rem', color: '#0369a1' }}></i>
              Price on Inquiry
            </div>
          ) : (
            <>
              <div className="card-rate-price">
                ₹{product.baseRate ? product.baseRate.toLocaleString('en-IN') : 0}
                <span className="card-rate-unit">/{product.unit ? product.unit.replace('per ', '') : 'Bundle'}</span>
              </div>
              {isBulkUnit && (
                <div className="card-per-pc-hint">(~ ₹{perPieceRate.toLocaleString('en-IN')}/pc)</div>
              )}
            </>
          )}
        </div>

        <div className="card-action-col">
          {isDisabled ? (
            <button type="button" className="btn-select-pill btn-disabled" disabled>
              <i className="fa-solid fa-ban"></i>
              <span>Unavailable</span>
            </button>
          ) : isOutOfStock ? (
            <button type="button" className="btn-select-pill btn-disabled" disabled style={{ background: '#fef2f2', color: '#991b1b', border: '1px solid #fca5a5' }}>
              <i className="fa-solid fa-box-archive"></i>
              <span>Out of Stock</span>
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
