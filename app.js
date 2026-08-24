// Govindasamy & Co - Customer User App Logic (Classic Business Theme & Robust PDF Generator)
const WHATSAPP_NUMBER = "919842932756"; // WhatsApp Sales Number: 9842932756

let products = [
    {
        id: 'p1',
        title: 'Heavy Duty Printed Panipat Door Mat',
        category: 'Panipat Mat',
        baseRate: 1800,
        unit: 'per Bundle',
        bundlePieces: 10,
        bundlesPerPack: 8,       // 8 bundles per standard master pack/bale
        compressibility: 0.80,   // Cotton 20% compression factor
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
        bundlesPerPack: 10,      // 10 bundles per standard master pack/bale
        compressibility: 0.80,   // Cotton 20% compression factor
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
        bundlesPerPack: 50,      // 50 single pieces per master pack/bale
        compressibility: 0.85,
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
        bundlesPerPack: 4,       // 4 bundles per standard master pack/bale
        compressibility: 0.85,
        minOrderNotice: 'Purchased per full Bundle (10 Pcs only)',
        description: 'Extra long hallway and kitchen runner mats bundled in 10-piece sets.',
        imageUrl: 'public/assets/logo.jpg'
    }
];

let selectedProductIds = new Set();
let itemQuantities = {}; // { 'p1': 2, 'p2': 5 }
let activeCategory = 'ALL';
let searchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
    initUserApp();
});

function initUserApp() {
    setupEventListeners();
    renderCatalog();
    updateSidePanel();
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

    // Mobile View Drawer Controls
    const mobileOrderToggleBtn = document.getElementById('mobileOrderToggleBtn');
    const orderFormColumn = document.getElementById('orderFormColumn');
    const mobileOverlay = document.getElementById('mobileOverlay');

    if (mobileOrderToggleBtn) {
        mobileOrderToggleBtn.addEventListener('click', () => {
            orderFormColumn.classList.toggle('mobile-open');
            mobileOverlay.classList.toggle('hidden');
        });
    }

    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', () => {
            orderFormColumn.classList.remove('mobile-open');
            mobileOverlay.classList.add('hidden');
        });
    }

    // WhatsApp Order Button
    document.getElementById('sendWhatsappBtn').addEventListener('click', () => {
        submitWhatsAppOrder();
    });

    // Download PDF Invoice Button
    document.getElementById('downloadPdfBtn').addEventListener('click', () => {
        generatePdfInvoice();
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
        const isSelected = selectedProductIds.has(p.id);
        const isBulkUnit = (p.unit === 'per Bundle' || p.unit === 'per Dozen') && p.bundlePieces > 0;
        const perPieceRate = isBulkUnit ? Math.round(p.baseRate / p.bundlePieces) : 0;

        const card = document.createElement('div');
        card.className = `product-card ${isSelected ? 'selected' : ''}`;

        card.innerHTML = `
            <!-- Selection Checkmark Badge -->
            <div class="select-checkbox-badge" title="Item Selected">
                <i class="fa-solid fa-check"></i>
            </div>

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

                <!-- Customer Purchase Rule Notice -->
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

                <!-- Select Item Action Button -->
                <button type="button" class="btn-select-item" onclick="toggleItemSelection('${p.id}')">
                    <i class="fa-solid ${isSelected ? 'fa-circle-check' : 'fa-circle-plus'}"></i>
                    <span>${isSelected ? 'Selected' : 'Select Item'}</span>
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function toggleItemSelection(productId) {
    if (selectedProductIds.has(productId)) {
        selectedProductIds.delete(productId);
        delete itemQuantities[productId];
    } else {
        selectedProductIds.add(productId);
        if (!itemQuantities[productId]) itemQuantities[productId] = 1;
    }

    renderCatalog();
    updateSidePanel();
}

/**
 * Calculates Master Packet / Bale estimation for mixed orders
 */
function calculateMasterPacks() {
    let totalCapacityPoints = 0;

    selectedProductIds.forEach(id => {
        const prod = products.find(p => p.id === id);
        const qty = itemQuantities[id] || 1;
        if (prod) {
            const bundlesPerPack = prod.bundlesPerPack || 8;
            const compressibility = prod.compressibility || 0.80;
            const basePointsPerUnit = (100 / bundlesPerPack) * compressibility;
            totalCapacityPoints += (basePointsPerUnit * qty);
        }
    });

    const estPacks = Math.max(1, Math.ceil(totalCapacityPoints / 100));
    return {
        totalPoints: totalCapacityPoints,
        estPacks: selectedProductIds.size === 0 ? 0 : estPacks
    };
}

function updateSidePanel() {
    const count = selectedProductIds.size;
    document.getElementById('sideSelectedBadge').innerText = `${count} Selected`;
    document.getElementById('sideTotalItems').innerText = `${count} ${count === 1 ? 'Item' : 'Items'}`;
    
    if (document.getElementById('mobileSelectedCount')) {
        document.getElementById('mobileSelectedCount').innerText = count;
    }

    const sideSelectedList = document.getElementById('sideSelectedList');

    if (count === 0) {
        sideSelectedList.innerHTML = `
            <div class="empty-selection-notice" id="emptyNotice">
                <i class="fa-solid fa-hand-pointer"></i>
                <p>No items selected yet</p>
                <span>Click <strong>"Select Item"</strong> on any mat card on the left to build your order!</span>
            </div>
        `;
        document.getElementById('sideTotalUnits').innerText = '0 Units';
        document.getElementById('sideTotalPacks').innerText = '0 Bales';
        document.getElementById('sideGrandTotal').innerText = '₹0';
        return;
    }

    sideSelectedList.innerHTML = '';
    let totalUnits = 0;
    let grandTotal = 0;

    selectedProductIds.forEach(id => {
        const prod = products.find(p => p.id === id);
        if (!prod) return;

        if (!itemQuantities[id]) itemQuantities[id] = 1;
        const currentQty = itemQuantities[id];

        totalUnits += currentQty;
        const itemSubtotal = prod.baseRate * currentQty;
        grandTotal += itemSubtotal;

        const row = document.createElement('div');
        row.className = 'side-item-row';
        row.innerHTML = `
            <div class="side-item-info">
                <div class="side-item-title">${prod.title}</div>
                <div class="side-item-rate">
                    ₹${prod.baseRate.toLocaleString('en-IN')} / ${prod.unit.replace('per ', '')}
                </div>
            </div>
            <div style="display:flex; align-items:center; gap:0.4rem;">
                <input type="number" class="side-qty-input" value="${currentQty}" min="1" onchange="updateItemQty('${id}', this.value)">
                <span style="font-size:0.75rem; font-weight:600; color:var(--text-secondary);">${prod.unit.replace('per ', '')}(s)</span>
                <button type="button" class="btn-remove-side" onclick="toggleItemSelection('${id}')" title="Remove item">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        `;
        sideSelectedList.appendChild(row);
    });

    const packInfo = calculateMasterPacks();

    document.getElementById('sideTotalUnits').innerText = `${totalUnits} Units`;
    document.getElementById('sideTotalPacks').innerText = `${packInfo.estPacks} Master ${packInfo.estPacks === 1 ? 'Bale' : 'Bales'}`;
    document.getElementById('sideGrandTotal').innerText = `₹${grandTotal.toLocaleString('en-IN')}`;
}

function updateItemQty(id, val) {
    let parsed = parseInt(val);
    if (isNaN(parsed) || parsed < 1) parsed = 1;
    itemQuantities[id] = parsed;
    updateSidePanel();
}

/* ==========================================================================
   WHATSAPP ORDER SUBMISSION (WhatsApp Number: 9842932756)
   ========================================================================== */
function submitWhatsAppOrder() {
    if (selectedProductIds.size === 0) {
        alert('Please click "Select Item" on at least 1 mat product to build your order.');
        return;
    }

    const company = document.getElementById('companyName').value.trim();
    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const gst = document.getElementById('custGst').value.trim();
    const address = document.getElementById('custAddress').value.trim();

    if (!company || !name || !phone || !address) {
        alert('Please fill in your Company Name, Contact Name, Phone, and Delivery Address in the order form on the side.');
        return;
    }

    const packInfo = calculateMasterPacks();

    let message = `*NEW MAT ORDER - GOVINDASAMY & CO*\n`;
    message += `====================================\n`;
    message += `🏢 *Company Name*: ${company}\n`;
    message += `👤 *Contact Person*: ${name}\n`;
    message += `📞 *Phone/WhatsApp*: ${phone}\n`;
    if (gst) message += `🆔 *GST No*: ${gst}\n`;
    message += `📍 *Delivery Address*: ${address}\n`;
    message += `====================================\n`;
    message += `*ORDERED MAT ITEMS*:\n\n`;

    let grandTotal = 0;
    let index = 1;

    selectedProductIds.forEach(id => {
        const prod = products.find(p => p.id === id);
        const qty = itemQuantities[id] || 1;
        if (prod) {
            const subtotal = prod.baseRate * qty;
            grandTotal += subtotal;

            message += `${index}. *${prod.title}*\n`;
            message += `   - Category: ${prod.category}\n`;
            message += `   - Quantity: *${qty} ${prod.unit.replace('per ', '')}(s)*\n`;
            if (prod.bundlePieces > 0) {
                message += `   - Total Pcs: (${qty * prod.bundlePieces} pieces)\n`;
            }
            message += `   - Rate: ₹${prod.baseRate.toLocaleString('en-IN')} / ${prod.unit.replace('per ', '')}\n`;
            message += `   - Subtotal: *₹${subtotal.toLocaleString('en-IN')}*\n\n`;
            index++;
        }
    });

    message += `====================================\n`;
    message += `📦 *ESTIMATED MASTER BALES*: *${packInfo.estPacks} Bales/Packs*\n`;
    message += `💰 *TOTAL ESTIMATED RATE*: *₹${grandTotal.toLocaleString('en-IN')}*\n`;
    message += `====================================\n`;
    message += `Please confirm availability & dispatch transport details. Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
}

/* ==========================================================================
   ROBUST & RELIABLE PDF ORDER INVOICE GENERATOR (jsPDF + AutoTable)
   Fixes: Standard Font Encoding (Rs. instead of ₹), Scope resolution, Multi-page
   ========================================================================== */
function generatePdfInvoice() {
    if (selectedProductIds.size === 0) {
        alert('Please select at least 1 mat item before downloading PDF invoice.');
        return;
    }

    const company = document.getElementById('companyName').value.trim() || "Valued Customer";
    const name = document.getElementById('custName').value.trim() || "Wholesale Buyer";
    const phone = document.getElementById('custPhone').value.trim() || "N/A";
    const gst = document.getElementById('custGst').value.trim();
    const address = document.getElementById('custAddress').value.trim() || "Standard Delivery";

    try {
        // Resolve jsPDF Constructor for all browser environments
        const jsPDFClass = (window.jspdf && window.jspdf.jsPDF) ? window.jspdf.jsPDF : (window.jsPDF || null);

        if (!jsPDFClass) {
            alert('PDF Generator library is loading or blocked. Please refresh the page and try again.');
            return;
        }

        const doc = new jsPDFClass({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const packInfo = calculateMasterPacks();

        // 1. Header & Brand Banner
        doc.setFillColor(1, 3, 86); // Royal Navy (#010356)
        doc.rect(0, 0, 210, 35, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.text("GOVINDASAMY & CO", 15, 18);

        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text("Quality Mat & Textile Products Manufacturer & Wholesaler", 15, 25);
        doc.text("Email: govindasamy.textitle@gmail.com | Phone: +91 98429 32756", 15, 30);

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("PURCHASE ORDER INVOICE", 130, 20);

        // 2. Customer Details Box
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("CUSTOMER & BILL-TO DETAILS:", 15, 45);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(`Company Name: ${company}`, 15, 52);
        doc.text(`Contact Person: ${name}`, 15, 58);
        doc.text(`Phone / WhatsApp: ${phone}`, 15, 64);
        if (gst) doc.text(`GSTIN: ${gst}`, 15, 70);
        
        // Multi-line address wrapping
        const splitAddress = doc.splitTextToSize(`Delivery Address: ${address}`, 100);
        doc.text(splitAddress, 15, gst ? 76 : 70);

        const today = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
        doc.setFont("helvetica", "bold");
        doc.text(`Order Date: ${today}`, 130, 45);
        doc.text(`Order Ref: GSC-ORD-${Date.now().toString().slice(-6)}`, 130, 52);
        doc.text(`Master Shipping Bales: ${packInfo.estPacks} Bales`, 130, 58);

        // 3. Itemized Table Data (Use "Rs." instead of "₹" to avoid standard font encoding errors)
        const tableData = [];
        let grandTotal = 0;
        let index = 1;

        selectedProductIds.forEach(id => {
            const prod = products.find(p => p.id === id);
            const qty = itemQuantities[id] || 1;
            if (prod) {
                const subtotal = prod.baseRate * qty;
                grandTotal += subtotal;
                
                const pcsInfo = prod.bundlePieces > 0 ? ` (${qty * prod.bundlePieces} pcs)` : '';

                tableData.push([
                    index.toString(),
                    `${prod.title} [${prod.category}]`,
                    `${qty} ${prod.unit.replace('per ', '')}s${pcsInfo}`,
                    `Rs. ${prod.baseRate.toLocaleString('en-IN')}`,
                    `Rs. ${subtotal.toLocaleString('en-IN')}`
                ]);
                index++;
            }
        });

        // 4. Render Table with AutoTable Plugin
        const autoTableFunc = doc.autoTable || window.jspdfAutoTable;

        if (typeof autoTableFunc === 'function') {
            autoTableFunc.call(doc, {
                startY: 85,
                head: [['S.No', 'Product Description', 'Quantity / Pack', 'Unit Rate', 'Subtotal Amount']],
                body: tableData,
                headStyles: {
                    fillColor: [1, 3, 86],
                    textColor: [255, 255, 255],
                    fontStyle: 'bold'
                },
                styles: {
                    fontSize: 9,
                    cellPadding: 4,
                    font: 'helvetica'
                },
                columnStyles: {
                    0: { cellWidth: 15, halign: 'center' },
                    1: { cellWidth: 80 },
                    2: { cellWidth: 35, halign: 'center' },
                    3: { cellWidth: 30, halign: 'right' },
                    4: { cellWidth: 30, halign: 'right' }
                }
            });
        }

        // Calculate Y position after table
        let finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 130;
        if (finalY > 240) {
            doc.addPage();
            finalY = 20;
        }

        // 5. Total Calculation Summary Box
        doc.setFillColor(248, 250, 252);
        doc.rect(110, finalY, 85, 24, 'F');
        doc.setDrawColor(226, 232, 240);
        doc.rect(110, finalY, 85, 24, 'D');

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text(`Est. Master Bales: ${packInfo.estPacks} Bales`, 115, finalY + 8);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(1, 3, 86);
        doc.text("GRAND TOTAL:", 115, finalY + 17);
        
        doc.setTextColor(37, 132, 2); // Emerald Green
        doc.setFontSize(13);
        doc.text(`Rs. ${grandTotal.toLocaleString('en-IN')}`, 155, finalY + 17);

        // 6. Footer & Terms
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text("Note: This is an automated Order Inquiry Invoice generated by Govindasamy & Co.", 15, finalY + 32);
        doc.text("Please share this PDF or order details to WhatsApp: +91 98429 32756 for payment & lorry transport confirmation.", 15, finalY + 37);

        // Save PDF file
        const cleanFileName = company.replace(/[^a-zA-Z0-9]/g, '_');
        doc.save(`Govindasamy_Mat_Order_${cleanFileName}.pdf`);

    } catch (err) {
        console.error("PDF Generation Exception:", err);
        alert("An error occurred while generating PDF: " + err.message);
    }
}
