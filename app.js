// Govindasamy & Co - Customer User App Logic
let products = [
    {
        id: 'p1',
        title: 'Heavy Duty Printed Panipat Door Mat',
        category: 'Panipat Mat',
        baseRate: 1800,
        unit: 'per Bundle',
        bundlePieces: 10,
        minOrderNotice: 'Purchased per full Bundle (10 Pcs only)',
        description: 'Authentic Panipat woven door mat sold in bundles of 10 pieces with vibrant traditional prints.',
        imageUrl: 'public/assets/Visiting card front.png'
    },
    {
        id: 'p2',
        title: 'Premium Handloom Cotton Export Mat',
        category: 'Export Mat',
        baseRate: 4500,
        unit: 'per Bundle',
        bundlePieces: 10,
        minOrderNotice: 'Purchased per full Bundle (10 Pcs only)',
        description: 'Export quality heavyweight cotton floor mats packed in 10-piece bundles with anti-skid backing.',
        imageUrl: 'public/assets/Visiting card back.jpg'
    },
    {
        id: 'p3',
        title: 'Durable Daily Use Local Mat',
        category: 'Local Mat',
        baseRate: 95,
        unit: 'per Piece',
        bundlePieces: 0,
        minOrderNotice: 'Available for individual piece purchase',
        description: 'Economical multi-color entryway mat suitable for home, office, and shop entrances.',
        imageUrl: 'public/assets/logo.jpg'
    },
    {
        id: 'p4',
        title: '6ft Anti-Slip Runner Long Mat',
        category: 'Long Mat',
        baseRate: 6800,
        unit: 'per Bundle',
        bundlePieces: 10,
        minOrderNotice: 'Purchased per full Bundle (10 Pcs only)',
        description: 'Extra long hallway and kitchen runner mats bundled in 10-piece sets.',
        imageUrl: 'public/assets/logo.jpg'
    }
];

let cart = [];
let activeCategory = 'ALL';
let searchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
    initUserApp();
});

function initUserApp() {
    setupEventListeners();
    renderCatalog();
    updateCartUI();
}

function setupEventListeners() {
    // Search Filter
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderCatalog();
    });

    // Category Tabs
    const categoryTabs = document.getElementById('categoryTabs');
    categoryTabs.addEventListener('click', (e) => {
        const btn = e.target.closest('.tab-btn');
        if (btn) {
            categoryTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeCategory = btn.getAttribute('data-category');
            
            document.getElementById('currentCategoryTitle').innerText = activeCategory === 'ALL' ? 'All Mat Products' : activeCategory;
            renderCatalog();
        }
    });

    // Sort Dropdown
    const sortSelect = document.getElementById('sortSelect');
    sortSelect.addEventListener('change', () => {
        renderCatalog();
    });

    // Cart Drawer Controls
    const openCartBtn = document.getElementById('openCartBtn');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartOverlay = document.getElementById('cartOverlay');

    openCartBtn.addEventListener('click', () => {
        cartOverlay.classList.remove('hidden');
    });

    closeCartBtn.addEventListener('click', () => {
        cartOverlay.classList.add('hidden');
    });

    cartOverlay.addEventListener('click', (e) => {
        if (e.target === cartOverlay) {
            cartOverlay.classList.add('hidden');
        }
    });

    // WhatsApp Order Submission
    const sendWhatsappOrderBtn = document.getElementById('sendWhatsappOrderBtn');
    sendWhatsappOrderBtn.addEventListener('click', () => {
        submitWhatsAppOrder();
    });
}

function renderCatalog() {
    const grid = document.getElementById('productGrid');
    const sortVal = document.getElementById('sortSelect').value;

    grid.innerHTML = '';

    // Filter Products
    let filtered = products.filter(p => {
        const matchesCategory = activeCategory === 'ALL' || p.category === activeCategory;
        const matchesSearch = !searchQuery || 
            p.title.toLowerCase().includes(searchQuery) || 
            p.category.toLowerCase().includes(searchQuery) ||
            p.description.toLowerCase().includes(searchQuery);
        return matchesCategory && matchesSearch;
    });

    // Sort Products
    if (sortVal === 'price-low') {
        filtered.sort((a, b) => a.baseRate - b.baseRate);
    } else if (sortVal === 'price-high') {
        filtered.sort((a, b) => b.baseRate - a.baseRate);
    }

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: #64748b;">
                <i class="fa-solid fa-rug" style="font-size: 3.5rem; color: var(--brand-emerald); margin-bottom: 1rem;"></i>
                <h3 style="color: var(--brand-navy); margin-bottom: 0.5rem;">No Mat Products Found</h3>
                <p>Try searching for a different keyword or category.</p>
            </div>
        `;
        return;
    }

    filtered.forEach(p => {
        const isBulkUnit = (p.unit === 'per Bundle' || p.unit === 'per Dozen') && p.bundlePieces > 0;
        const perPieceRate = isBulkUnit ? Math.round(p.baseRate / p.bundlePieces) : 0;

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="card-img-wrapper">
                <img src="${p.imageUrl}" alt="${p.title}" class="card-img" onerror="this.src='public/assets/logo.jpg'">
                <span class="category-tag">${p.category}</span>
                ${isBulkUnit ? `
                    <span class="bundle-badge">
                        <i class="fa-solid fa-boxes-packing"></i> ${p.bundlePieces} Pcs / ${p.unit.replace('per ', '')}
                    </span>
                ` : ''}
            </div>

            <div class="card-body">
                <h3 class="product-title">${p.title}</h3>
                <p class="product-details">${p.description}</p>

                <!-- Customer Purchase Notice -->
                <div class="purchase-rule-box">
                    <i class="fa-solid fa-circle-info"></i>
                    <span>${p.minOrderNotice || (isBulkUnit ? `Must be purchased per ${p.unit.replace('per ', '')} (${p.bundlePieces} Pcs)` : 'Available for single piece purchase')}</span>
                </div>

                <div class="price-box">
                    <div>
                        <span class="rate-label">Wholesale Rate</span>
                        <div class="rate-value">
                            ₹${p.baseRate.toLocaleString('en-IN')}
                            <span class="unit-label">/${p.unit.replace('per ', '')}</span>
                        </div>
                        ${isBulkUnit ? `
                            <div class="piece-rate-hint">(~ ₹${perPieceRate.toLocaleString('en-IN')} / pc)</div>
                        ` : ''}
                    </div>
                </div>

                <div class="card-action-bar">
                    <div class="qty-control">
                        <button type="button" class="btn-qty" onclick="changeQty('${p.id}', -1)">-</button>
                        <span class="qty-val" id="qty_${p.id}">1</span>
                        <button type="button" class="btn-qty" onclick="changeQty('${p.id}', 1)">+</button>
                    </div>
                    <button type="button" class="btn-add-cart" onclick="addToCart('${p.id}')">
                        <i class="fa-solid fa-cart-plus"></i> Add to Order
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function changeQty(productId, delta) {
    const qtyElem = document.getElementById(`qty_${productId}`);
    if (!qtyElem) return;
    let current = parseInt(qtyElem.innerText) || 1;
    current = Math.max(1, current + delta);
    qtyElem.innerText = current;
}

function addToCart(productId) {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    const qtyElem = document.getElementById(`qty_${productId}`);
    const qty = parseInt(qtyElem ? qtyElem.innerText : '1') || 1;

    const existingIndex = cart.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
        cart[existingIndex].qty += qty;
    } else {
        cart.push({
            ...prod,
            qty: qty
        });
    }

    // Reset qty indicator
    if (qtyElem) qtyElem.innerText = '1';

    updateCartUI();

    // Show toast or open drawer
    document.getElementById('cartOverlay').classList.remove('hidden');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

function updateCartUI() {
    const cartCountBadge = document.getElementById('cartCountBadge');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartTotalItems = document.getElementById('cartTotalItems');
    const cartTotalPrice = document.getElementById('cartTotalPrice');

    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.baseRate * item.qty), 0);

    cartCountBadge.innerText = totalQty;
    cartTotalItems.innerText = totalQty;
    cartTotalPrice.innerText = `₹${totalPrice.toLocaleString('en-IN')}`;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div style="text-align: center; padding: 3rem 1rem; color: #94a3b8;">
                <i class="fa-solid fa-bag-shopping" style="font-size: 3rem; color: var(--border-color); margin-bottom: 1rem;"></i>
                <p style="font-weight: 600;">Your order list is empty.</p>
                <span style="font-size: 0.8rem;">Browse products above and click "Add to Order".</span>
            </div>
        `;
        return;
    }

    cartItemsContainer.innerHTML = '';
    cart.forEach(item => {
        const itemRow = document.createElement('div');
        itemRow.className = 'cart-item';
        itemRow.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.title}" class="cart-item-img" onerror="this.src='public/assets/logo.jpg'">
            <div class="cart-item-info">
                <h4 class="cart-item-title">${item.title}</h4>
                <div class="cart-item-price">
                    ₹${item.baseRate.toLocaleString('en-IN')} x ${item.qty} ${item.unit.replace('per ', '')}s
                    <div style="font-size: 0.8rem; color: var(--text-primary); font-weight: 800;">
                        = ₹${(item.baseRate * item.qty).toLocaleString('en-IN')}
                    </div>
                </div>
            </div>
            <button type="button" class="btn-remove-item" onclick="removeFromCart('${item.id}')" title="Remove item">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        `;
        cartItemsContainer.appendChild(itemRow);
    });
}

function submitWhatsAppOrder() {
    if (cart.length === 0) {
        alert('Your order is empty. Please add mat products before ordering.');
        return;
    }

    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const address = document.getElementById('custAddress').value.trim();

    if (!name || !phone) {
        alert('Please enter your Name and Phone Number so we can confirm your order.');
        return;
    }

    let message = `*NEW MAT ORDER - Govindasamy & Co*\n`;
    message += `------------------------------------\n`;
    message += `👤 *Customer Name*: ${name}\n`;
    message += `📞 *Phone*: ${phone}\n`;
    if (address) message += `📍 *Delivery Address*: ${address}\n`;
    message += `------------------------------------\n`;
    message += `*ORDER ITEMS*:\n`;

    let totalAmount = 0;
    cart.forEach((item, index) => {
        const lineTotal = item.baseRate * item.qty;
        totalAmount += lineTotal;
        message += `${index + 1}. *${item.title}*\n`;
        message += `   - Category: ${item.category}\n`;
        message += `   - Qty: ${item.qty} ${item.unit.replace('per ', '')}(s)\n`;
        if (item.bundlePieces > 0) {
            message += `   - Pack Info: (${item.bundlePieces * item.qty} total pieces)\n`;
        }
        message += `   - Subtotal: ₹${lineTotal.toLocaleString('en-IN')}\n\n`;
    });

    message += `------------------------------------\n`;
    message += `💰 *TOTAL ESTIMATED RATE*: *₹${totalAmount.toLocaleString('en-IN')}*\n`;
    message += `------------------------------------\n`;
    message += `Please confirm availability and dispatch details. Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919876543210?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
}
