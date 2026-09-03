import React, { useState } from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ products, selectedProductIds, onToggleSelect, activeCategory, searchQuery }) {
  const [sortOption, setSortOption] = useState('featured');

  let filtered = products.filter((p) => {
    const matchesCategory = activeCategory === 'ALL' || p.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      (p.title && p.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  filtered.sort((a, b) => {
    const aDisabled = !!a.isDisabled;
    const bDisabled = !!b.isDisabled;
    if (aDisabled && !bDisabled) return 1;  // Disabled item moved to last
    if (!aDisabled && bDisabled) return -1; // Enabled item kept in front

    if (sortOption === 'price-low') {
      return a.baseRate - b.baseRate;
    } else if (sortOption === 'price-high') {
      return b.baseRate - a.baseRate;
    }
    return 0;
  });

  return (
    <>
      <div className="catalog-header">
        <div>
          <h2>{activeCategory === 'ALL' ? 'All Mat Products' : activeCategory}</h2>
          <p>Click "Select Item" on cards below to select products for your wholesale order.</p>
        </div>
        <div className="sort-box">
          <label><i className="fa-solid fa-arrow-down-short-wide"></i> Sort By:</label>
          <select className="filter-select" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="featured">Featured Collection</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Customer Notice Banner for Seasonal and Stock Pricing */}
      <div className="wholesale-pricing-alert-banner">
        <div className="banner-icon">
          <i className="fa-solid fa-circle-info"></i>
        </div>
        <div className="banner-text">
          <strong>Wholesale Pricing Notice:</strong> Quoted rates are factory standard wholesale rates. Price may differ based on the season item or the stock quantity at dispatch.
        </div>
      </div>

      <div className="product-grid">
        {filtered.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem 1rem', color: '#64748b' }}>
            <i className="fa-solid fa-rug" style={{ fontSize: '3.5rem', color: 'var(--brand-emerald)', marginBottom: '1rem' }}></i>
            <h3 style={{ color: 'var(--brand-navy)', marginBottom: '0.5rem' }}>No Mat Products Found</h3>
            <p>Try searching for a different keyword or category.</p>
          </div>
        ) : (
          filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isSelected={selectedProductIds.includes(product.id)}
              onToggleSelect={onToggleSelect}
            />
          ))
        )}
      </div>
    </>
  );
}
