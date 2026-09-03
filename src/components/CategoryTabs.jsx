import React from 'react';

export default function CategoryTabs({
  activeCategory,
  setActiveCategory,
  dynamicCategories = [],
  sortOption = 'default',
  setSortOption
}) {
  const baseCategories = [
    { id: 'ALL', label: 'All Products', icon: 'fa-table-cells-large' },
    { id: 'Panipat Mat', label: 'Panipat Mat', icon: 'fa-layer-group' },
    { id: 'Export Mat', label: 'Export Mat', icon: 'fa-globe' },
    { id: 'Local Mat', label: 'Local Mat', icon: 'fa-location-dot' },
    { id: 'Long Mat', label: 'Long Mat', icon: 'fa-pen-ruler' }
  ];

  const customTabs = dynamicCategories
    .filter((catName) => !baseCategories.some((b) => b.id === catName))
    .map((catName) => ({ id: catName, label: catName, icon: 'fa-rug' }));

  const categories = [...baseCategories, ...customTabs];

  return (
    <div className="catalog-nav-bar">
      <div className="category-tabs-group">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`tab-btn-pill ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            <i className={`fa-solid ${cat.icon}`}></i>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
