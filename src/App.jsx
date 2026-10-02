import React, { useState, useEffect } from 'react';
import { db, collection, onSnapshot, doc } from './firebase';
import TopNav from './components/TopNav';
import TrustBar from './components/TrustBar';
import HeroBanner from './components/HeroBanner';
import CategoryTabs from './components/CategoryTabs';
import ProductGrid from './components/ProductGrid';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import FloatingBar from './components/FloatingBar';
import OrderLayer from './components/OrderLayer';
import InvoiceModal from './components/InvoiceModal';
import ModernToastContainer from './components/ModernToastContainer';
import LottieAnimation from './components/LottieAnimation';
import { calculateMasterPacks } from './utils/packetEngine';
import './styles.css';

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [dynamicCategories, setDynamicCategories] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [itemQuantities, setItemQuantities] = useState({});
  const [isOrderLayerOpen, setIsOrderLayerOpen] = useState(false);
  const [activeProductDetail, setActiveProductDetail] = useState(null);
  const [sortOption, setSortOption] = useState('default');
  const [masterBaleRate, setMasterBaleRate] = useState(100);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [globalHidePrices, setGlobalHidePrices] = useState(
    localStorage.getItem('gsco_global_hide_prices') === 'true'
  );
  const [invoiceData, setInvoiceData] = useState({
    company: '',
    name: '',
    phone: '',
    gst: '',
    address: ''
  });

  // Real-time Firestore & Broadcast Sync
  useEffect(() => {
    // 1. Instant fallback from localStorage
    const cached = JSON.parse(localStorage.getItem('gsco_catalog_products') || '[]');
    if (cached.length > 0) {
      setProducts(cached);
      setLoading(false);
    }

    // 2. Real-time broadcast channel listener for cross-tab speed
    let channel;
    if (typeof window !== 'undefined' && window.BroadcastChannel) {
      channel = new BroadcastChannel('gsco_realtime_channel');
      channel.onmessage = (event) => {
        if (event.data?.type === 'PRODUCT_ADDED') {
          setProducts((prev) => {
            if (prev.some((p) => p.id === event.data.product.id)) return prev;
            return [event.data.product, ...prev];
          });
        } else if (event.data?.type === 'PRODUCT_UPDATED') {
          setProducts((prev) =>
            prev.map((p) => (p.id === event.data.product.id ? { ...p, ...event.data.product } : p))
          );
        } else if (event.data?.type === 'PRODUCT_DELETED') {
          setProducts((prev) => prev.filter((p) => p.id !== event.data.productId));
        } else if (event.data?.type === 'MASTER_BALE_RATE_UPDATED') {
          if (event.data.rate !== undefined) setMasterBaleRate(Number(event.data.rate));
        } else if (event.data?.type === 'GLOBAL_PRICE_VISIBILITY_UPDATED') {
          const hideState = Boolean(event.data.hideAllPrices);
          setGlobalHidePrices(hideState);
          localStorage.setItem('gsco_global_hide_prices', String(hideState));
        }
      };
    }

    // 3. Real-time Firestore listener for live cloud database sync
    const productsRef = collection(db, 'products');
    const unsubscribeProducts = onSnapshot(productsRef, (snapshot) => {
      const fetched = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      setProducts(fetched);
      setLoading(false);
      localStorage.setItem('gsco_catalog_products', JSON.stringify(fetched));
    }, (error) => {
      console.warn('Firestore products sync info:', error.message);
      setLoading(false);
    });

    const categoriesRef = collection(db, 'categories');
    const unsubscribeCategories = onSnapshot(categoriesRef, (snapshot) => {
      const cats = snapshot.docs.map((d) => d.data().name).filter(Boolean);
      if (cats.length > 0) {
        setDynamicCategories(cats);
      }
    }, (error) => {
      console.warn('Firestore categories sync info:', error.message);
    });

    // 4. Live sync Global Master Bale Rate from Firestore
    const configRef = doc(db, 'settings', 'master_bale_config');
    const unsubscribeConfig = onSnapshot(configRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.rate !== undefined && data.rate !== null) {
          setMasterBaleRate(Number(data.rate));
        }
      }
    }, (error) => {
      console.warn('Firestore master bale config sync info:', error.message);
    });

    // 5. Live sync Global Master Price Visibility from Firestore settings/price_config
    const priceConfigRef = doc(db, 'settings', 'price_config');
    const unsubscribePriceConfig = onSnapshot(priceConfigRef, (snapshot) => {
      if (snapshot.exists()) {
        const hideState = Boolean(snapshot.data().hideAllPrices);
        setGlobalHidePrices(hideState);
        localStorage.setItem('gsco_global_hide_prices', String(hideState));
      }
    }, (error) => {
      console.warn('Firestore price config sync info:', error.message);
    });

    return () => {
      unsubscribeProducts();
      unsubscribeCategories();
      unsubscribeConfig();
      unsubscribePriceConfig();
      if (channel) channel.close();
    };
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

  const handleUpdateQty = (productId, newQty) => {
    setItemQuantities({ ...itemQuantities, [productId]: newQty });
  };

  const handleRemoveItem = (productId) => {
    setSelectedProductIds(selectedProductIds.filter((id) => id !== productId));
    const updated = { ...itemQuantities };
    delete updated[productId];
    setItemQuantities(updated);
  };

  // Map products to hide price globally if Admin enabled globalHidePrices or individual product hidePrice
  const displayProducts = React.useMemo(() => {
    return products.map((p) => ({
      ...p,
      hidePrice: globalHidePrices || Boolean(p.hidePrice)
    }));
  }, [products, globalHidePrices]);

  const hasAnyHiddenPrice = React.useMemo(() => {
    if (globalHidePrices) return true;
    return selectedProductIds.some((id) => {
      const p = products.find((prod) => prod.id === id);
      return Boolean(p?.hidePrice);
    });
  }, [selectedProductIds, products, globalHidePrices]);

  // Calculate packet bundling & subtotal calculations
  const packInfo = calculateMasterPacks(selectedProductIds, displayProducts, itemQuantities);
  let grandTotal = 0;
  selectedProductIds.forEach((id) => {
    const prod = displayProducts.find((p) => p.id === id);
    const qty = itemQuantities[id] || 1;
    if (prod) {
      grandTotal += prod.baseRate * qty;
    }
  });

  const activeProductDetailDisplay = React.useMemo(() => {
    if (!activeProductDetail) return null;
    const found = displayProducts.find((p) => p.id === activeProductDetail.id);
    return found || activeProductDetail;
  }, [activeProductDetail, displayProducts]);

  return (
    <div className="app-layout">
      <ModernToastContainer />
      <TopNav
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCount={selectedProductIds.length}
        onOpenOrderLayer={() => setIsOrderLayerOpen(true)}
      />

      <TrustBar />

      <main className="main-catalog-container">
        <HeroBanner />

        <CategoryTabs
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          customCategories={dynamicCategories}
        />

        {loading && products.length === 0 ? (
          <div className="catalog-loading-state">
            <LottieAnimation animationPath="/assets/loading.json" width={140} height={140} />
            <p>Loading factory wholesale mat catalog...</p>
          </div>
        ) : (
          <ProductGrid
            products={displayProducts}
            selectedProductIds={selectedProductIds}
            onToggleSelect={handleToggleSelect}
            onOpenDetail={(prod) => setActiveProductDetail(prod)}
            activeCategory={activeCategory}
            searchQuery={searchQuery}
            sortOption={sortOption}
            setSortOption={setSortOption}
          />
        )}
      </main>

      <FloatingBar
        selectedCount={selectedProductIds.length}
        grandTotal={grandTotal}
        hasAnyHiddenPrice={hasAnyHiddenPrice}
        onOpenOrderLayer={() => setIsOrderLayerOpen(true)}
      />

      {/* Product Detail / Zoom Modal */}
      <ProductDetailModal
        product={activeProductDetailDisplay}
        isOpen={Boolean(activeProductDetailDisplay)}
        onClose={() => setActiveProductDetail(null)}
        isSelected={activeProductDetailDisplay ? selectedProductIds.includes(activeProductDetailDisplay.id) : false}
        onToggleSelect={handleToggleSelect}
        qty={activeProductDetailDisplay ? (itemQuantities[activeProductDetailDisplay.id] || 1) : 1}
        onUpdateQty={handleUpdateQty}
      />

      <OrderLayer
        isOpen={isOrderLayerOpen}
        onClose={() => setIsOrderLayerOpen(false)}
        selectedProductIds={selectedProductIds}
        products={displayProducts}
        itemQuantities={itemQuantities}
        hasAnyHiddenPrice={hasAnyHiddenPrice}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        masterBaleRate={masterBaleRate}
        onUpdateMasterBaleRate={setMasterBaleRate}
        onOpenInvoicePreview={(data) => {
          setInvoiceData(data);
          setIsInvoiceModalOpen(true);
        }}
      />

      {/* Modern Responsive Purchase Order Invoice Modal */}
      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        company={invoiceData.company}
        name={invoiceData.name}
        phone={invoiceData.phone}
        gst={invoiceData.gst}
        address={invoiceData.address}
        selectedProductIds={selectedProductIds}
        products={displayProducts}
        itemQuantities={itemQuantities}
        hasAnyHiddenPrice={hasAnyHiddenPrice}
        packInfo={packInfo}
        masterBaleRate={masterBaleRate}
        onUpdateMasterBaleRate={setMasterBaleRate}
      />

      {/* Footer */}
      <footer className="main-footer">
        <div className="footer-top-tier">
          <div className="footer-container">
            <div className="footer-brand">
              <img
                src="/assets/logo.jpg"
                alt="Govindasamy & Co"
                className="footer-logo"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div>
                <h4>GOVINDASAMY & CO</h4>
                <p>Quality Mat & Textile Products Manufacturer & Wholesaler</p>
              </div>
            </div>

            <div className="footer-col footer-col-address">
              <a href="https://maps.app.goo.gl/651k1dFnksLthHSq6" target="_blank" rel="noreferrer">
                <i className="fa-solid fa-location-dot"></i>
                <span>65, Kamaraj St, Erode - 638001<br />Tamil Nadu, India</span>
              </a>
            </div>

            <div className="footer-col footer-col-contacts">
              <p>
                <i className="fa-solid fa-envelope"></i>
                <span>{import.meta.env.VITE_STORE_EMAIL || 'govindasamy.textitle@gmail.com'}</span>
              </p>
              <p>
                <i className="fa-solid fa-phone"></i>
                <span>+91 98427 12345</span>
              </p>
            </div>

            <div className="footer-action-col">
              <a
                href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '919842932756'}`}
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp-footer"
              >
                <i className="fa-brands fa-whatsapp"></i>
                <span>WhatsApp Inquiry</span>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom-tier">
          <div className="footer-container">
            <span>© 2026 Govindasamy & Co. All Rights Reserved. • Factory Wholesale Portal</span>
            <span className="footer-tech-tag">Powered by React & Cloud Firestore Realtime Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
