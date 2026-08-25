import React from 'react';

export default function TopNav({ searchQuery, setSearchQuery, selectedCount, onOpenOrderLayer }) {
  return (
    <header className="top-nav">
      <div className="nav-container">
        <div className="brand-group">
          <div className="logo-wrapper">
            <img
              src="/public/assets/logo.jpg"
              alt="Govindasamy & Co Logo"
              className="brand-logo"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/52?text=GS'; }}
            />
          </div>
          <div className="brand-titles">
            <h1>GOVINDASAMY & CO</h1>
            <span className="brand-tagline">Quality Mat & Textile Products • Wholesale & Export Portal</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-box">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input
            type="text"
            placeholder="Search Panipat, Export, Local, Long Mats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Header Action Buttons */}
        <div className="nav-actions">
          <button type="button" className="btn btn-header-order" onClick={onOpenOrderLayer}>
            <i className="fa-solid fa-file-invoice"></i>
            <span>Order Form</span>
            <span className="header-count-badge">{selectedCount}</span>
          </button>

          {/* WhatsApp Direct Chat Button (No raw phone number displayed) */}
          <a
            href="https://wa.me/919842932756"
            target="_blank"
            rel="noreferrer"
            className="btn btn-whatsapp-header"
            title="Chat with Wholesale Sales on WhatsApp"
          >
            <i className="fa-brands fa-whatsapp" style={{ fontSize: '1.4rem' }}></i>
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>WhatsApp Chat</span>
          </a>
        </div>
      </div>
    </header>
  );
}
