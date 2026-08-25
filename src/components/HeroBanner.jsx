import React from 'react';

export default function HeroBanner() {
  return (
    <div className="hero-banner">
      <div className="hero-content">
        <span className="hero-badge"><i className="fa-solid fa-award"></i> Registered Wholesale Supplier</span>
        <h2>Wholesale Mat Products Catalog</h2>
        <p>Click <strong>"Select Item"</strong> on any mat card to build your order. Your order form is stored in a separate floating layer so item browsing remains 100% clear and un-disturbed!</p>
      </div>
      <div className="hero-card-container">
        <img
          src="/public/assets/Visiting card front.png"
          alt="Visiting Card Front"
          className="hero-img"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/95?text=Card'; }}
        />
      </div>
    </div>
  );
}
