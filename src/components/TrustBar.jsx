import React from 'react';

export default function TrustBar() {
  return (
    <div className="trust-bar">
      <div className="trust-container">
        <a
          href="https://maps.app.goo.gl/651k1dFnksLthHSq6"
          target="_blank"
          rel="noreferrer"
          className="trust-item location-link"
          title="Open Location in Google Maps"
        >
          <i className="fa-solid fa-location-dot" style={{ color: 'var(--brand-gold)' }}></i>
          <span>65, Kamaraj St, Erode - 638001, Tamil Nadu, India</span>
        </a>
        <div className="trust-divider"></div>
        <div className="trust-item">
          <i className="fa-solid fa-industry" style={{ color: 'var(--brand-navy)' }}></i>
          <span>Factory Wholesale Rates</span>
        </div>
        <div className="trust-divider"></div>
        <div className="trust-item">
          <i className="fa-solid fa-truck" style={{ color: 'var(--brand-navy)' }}></i>
          <span>Pan-India Lorry Delivery</span>
        </div>
        <div className="trust-divider"></div>
        <div className="trust-item">
          <i className="fa-solid fa-leaf" style={{ color: 'var(--brand-gold)' }}></i>
          <span>Premium Cotton Products</span>
        </div>
      </div>
    </div>
  );
}
