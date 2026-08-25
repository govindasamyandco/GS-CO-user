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
          style={{ textDecoration: 'none', color: 'var(--brand-navy)' }}
        >
          <i className="fa-solid fa-location-dot" style={{ color: 'var(--brand-gold)' }}></i>
          <span><strong>Factory & Store:</strong> 65, Kamaraj St, NMS Compound, Erode Fort, Erode 638001</span>
        </a>
        <div className="trust-item"><i className="fa-solid fa-industry"></i> Factory Wholesale Rates</div>
        <div className="trust-item"><i className="fa-solid fa-truck-fast"></i> Pan-India Lorry Transport</div>
        <div className="trust-item"><i className="fa-solid fa-certificate"></i> Premium Cotton Weave</div>
      </div>
    </div>
  );
}
