import React from 'react';

export default function CategoryTabs({ activeCategory, setActiveCategory }) {
  const categories = [
    { id: 'ALL', label: 'All Products', icon: 'fa-border-all' },
    { id: 'Panipat Mat', label: 'Panipat Mat', icon: 'fa-rug' },
    { id: 'Export Mat', label: 'Export Mat', icon: 'fa-plane-departure' },
    { id: 'Local Mat', label: 'Local Mat', icon: 'fa-house' },
    { id: 'Long Mat', label: 'Long Mat', icon: 'fa-ruler-horizontal' }
  ];

  return (
    <div className="category-tabs">
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          className={`tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
          onClick={() => setActiveCategory(cat.id)}
        >
          <i className={`fa-solid ${cat.icon}`}></i> {cat.label}
        </button>
      ))}
    </div>
  );
}
