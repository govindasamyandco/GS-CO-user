import React, { useState, useEffect } from 'react';
import { db, collection, onSnapshot } from './firebase';
import TopNav from './components/TopNav';
import TrustBar from './components/TrustBar';
import HeroBanner from './components/HeroBanner';
import CategoryTabs from './components/CategoryTabs';
import ProductGrid from './components/ProductGrid';
import FloatingBar from './components/FloatingBar';
import OrderLayer from './components/OrderLayer';
import './styles.css';

export default function App() {
  const [products, setProducts] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [itemQuantities, setItemQuantities] = useState({});
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isOrderLayerOpen, setIsOrderLayerOpen] = useState(false);

  useEffect(() => {
    const productsRef = collection(db, 'products');
    const unsubscribe = onSnapshot(productsRef, (snapshot) => {
      const fetched = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      setProducts(fetched);
    }, (error) => {
      console.error('Firestore customer sync error:', error);
    });

    return () => unsubscribe();
  }, []);

  const handleToggleSelect = (productId) => {
    if (selectedProductIds.includes(productId)) {
      setSelectedProductIds(selectedProductIds.filter((id) => id !== productId));
      const updated = { ...itemQuantities };
      delete updated[productId];
      setItemQuantities(updated);
    } else {
      setSelectedProductIds([...selectedProductIds, productId]);
      if (!itemQuantities[productId]) {
        setItemQuantities({ ...itemQuantities, [productId]: 1 });
      }
    }
  };

  const handleUpdateQty = (productId, val) => {
    setItemQuantities({ ...itemQuantities, [productId]: val });
  };

  const handleRemoveItem = (productId) => {
    handleToggleSelect(productId);
  };

  let grandTotal = 0;
  selectedProductIds.forEach((id) => {
    const prod = products.find((p) => p.id === id);
    const qty = itemQuantities[id] || 1;
    if (prod) grandTotal += prod.baseRate * qty;
  });

  return (
    <div className="classic-business-theme">
      <TopNav
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCount={selectedProductIds.length}
        onOpenOrderLayer={() => setIsOrderLayerOpen(true)}
      />

      <TrustBar />

      <main className="main-catalog-container">
        <HeroBanner />

        <CategoryTabs activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

        <ProductGrid
          products={products}
          selectedProductIds={selectedProductIds}
          onToggleSelect={handleToggleSelect}
          activeCategory={activeCategory}
          searchQuery={searchQuery}
        />
      </main>

      <FloatingBar
        selectedCount={selectedProductIds.length}
        grandTotal={grandTotal}
        onOpenOrderLayer={() => setIsOrderLayerOpen(true)}
      />

      <OrderLayer
        isOpen={isOrderLayerOpen}
        onClose={() => setIsOrderLayerOpen(false)}
        selectedProductIds={selectedProductIds}
        products={products}
        itemQuantities={itemQuantities}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
      />

      <footer className="main-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <img
              src="/public/assets/logo.jpg"
              alt="Govindasamy & Co"
              className="footer-logo"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/45?text=GS'; }}
            />
            <div>
              <h4>GOVINDASAMY & CO</h4>
              <p>Quality Mat & Textile Products Manufacturer & Wholesaler</p>
            </div>
          </div>
          <div className="footer-contact">
            <p><i className="fa-solid fa-envelope"></i> govindasamy.textitle@gmail.com</p>
            <p><i className="fa-solid fa-phone"></i> WhatsApp Order Line: <strong>+91 98429 32756</strong></p>
          </div>
        </div>
        <div className="footer-copyright">
          © 2026 Govindasamy & Co. All Rights Reserved. • Powered by React & Firebase Firestore Sync
        </div>
      </footer>
    </div>
  );
}
