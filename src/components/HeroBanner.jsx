import React, { useState } from 'react';

export default function HeroBanner() {
  const [showPill, setShowPill] = useState(true);

  return (
    <div className="hero-banner">
      <div className="hero-banner-inner">
        <h1 className="hero-catalog-title">WHOLESALE MAT PRODUCTS CATALOG</h1>
        <p className="hero-catalog-subtitle">Factory Direct • Best Quality • Bulk Wholesale Only</p>
        
        {showPill && (
          <div className="hero-info-pill">
            <i className="fa-solid fa-circle-info"></i>
            <span>You are viewing wholesale catalog. Add items to Order Form to enquire prices.</span>
            <button
              type="button"
              className="hero-pill-close"
              onClick={() => setShowPill(false)}
              aria-label="Dismiss banner notice"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
