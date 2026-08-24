// Govindasamy & Co - Customer User App Logic (Selection & PDF Order Generator)
const WHATSAPP_NUMBER = "919842932756"; // WhatsApp Number: 9842932756

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
    updateSelectionUI();
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

    // Open Selected Drawer Button
    document.getElementById('openSelectedBtn').addEventListener('click', () => {
        if (selectedProductIds.size === 0) {
            alert('Please select at least 1 mat product from the catalog first.');
            return;
        }
        openOrderModal();
    });

    // Done Button in Floating Bar
    document.getElementById('doneSelectBtn').addEventListener('click', () => {
        openOrderModal();
    });

    // Close Order Modal
    document.getElementById('closeOrderModalBtn').addEventListener('click', () => {
        document.getElementById('orderModalOverlay').classList.add('hidden');
    });

    document.getElementById('orderModalOverlay').addEventListener('click', (e) => {
        if (e.target === document.getElementById('orderModalOverlay')) {
            document.getElementById('orderModalOverlay').classList.add('hidden');
        }
    });

    // WhatsApp Submit
    document.getElementById('sendWhatsappBtn').addEventListener('click', () => {
        submitWhatsAppOrder();
    });

    // Download PDF Invoice
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
        card.setAttribute('onclick', `toggleItemSelection('${p.id}', event)`);

        card.innerHTML = `
            <div class="select-checkbox-wrapper">
                <input type="checkbox" class="product-select-checkbox" ${isSelected ? 'checked' : ''} onclick="event.stopPropagation(); toggleItemSelection('${p.id}', event)">
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

                <button type="button" class="select-toggle-btn">
                    <i class="fa-solid ${isSelected ? 'fa-square-check' : 'fa-square'}"></i>
                    <span>${isSelected ? 'Selected for Order' : 'Click to Select'}</span>
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function toggleItemSelection(productId, event) {
    if (event) event.stopPropagation();

    if (selectedProductIds.has(productId)) {
        selectedProductIds.delete(productId);
        delete itemQuantities[productId];
    } else {
        selectedProductIds.add(productId);
        if (!itemQuantities[productId]) itemQuantities[productId] = 1;
    }

    renderCatalog();
    updateSelectionUI();
}

function updateSelectionUI() {
    const count = selectedProductIds.size;
    document.getElementById('selectedCountBadge').innerText = count;
    document.getElementById('selectedItemsText').innerText = `${count} Mat Item${count === 1 ? '' : 's'} Selected`;

    const floatingBar = document.getElementById('floatingBar');
    if (count > 0) {
        floatingBar.classList.remove('hidden');
    } else {
        floatingBar.classList.add('hidden');
    }
}

function openOrderModal() {
    if (selectedProductIds.size === 0) return;

    const listContainer = document.getElementById('selectedItemsList');
    listContainer.innerHTML = '';

    selectedProductIds.forEach(id => {
        const prod = products.find(p => p.id === id);
        if (!prod) return;

        if (!itemQuantities[id]) itemQuantities[id] = 1;
        const currentQty = itemQuantities[id];

        const row = document.createElement('div');
        row.className = 'order-item-row';
        row.innerHTML = `
            <div class="order-item-detail">
                <img src="${prod.imageUrl}" alt="${prod.title}" class="order-item-thumb" onerror="this.src='public/assets/logo.jpg'">
                <div>
                    <h5 class="order-item-title">${prod.title}</h5>
                    <span class="order-item-meta">Rate: ₹${prod.baseRate.toLocaleString('en-IN')} / ${prod.unit.replace('per ', '')}</span>
                </div>
            </div>
            <div class="order-item-qty">
                <label style="font-size:0.8rem; font-weight:600;">Qty:</label>
                <input type="number" class="qty-input" value="${currentQty}" min="1" onchange="updateItemQty('${id}', this.value)">
                <span style="font-size:0.85rem; font-weight:600; color:var(--text-secondary);">${prod.unit.replace('per ', '')}(s)</span>
            </div>
        `;
        listContainer.appendChild(row);
    });

    updateOrderSummary();
    document.getElementById('orderModalOverlay').classList.remove('hidden');
}

function updateItemQty(id, val) {
    let parsed = parseInt(val);
    if (isNaN(parsed) || parsed < 1) parsed = 1;
    itemQuantities[id] = parsed;
    updateOrderSummary();
}

function updateOrderSummary() {
    let totalItems = selectedProductIds.size;
    let totalUnits = 0;
    let grandTotal = 0;

    selectedProductIds.forEach(id => {
        const prod = products.find(p => p.id === id);
        const qty = itemQuantities[id] || 1;
        if (prod) {
            totalUnits += qty;
            grandTotal += (prod.baseRate * qty);
        }
    });

    document.getElementById('summaryItemCount').innerText = totalItems;
    document.getElementById('summaryTotalUnits').innerText = `${totalUnits} Units`;
    document.getElementById('summaryGrandTotal').innerText = `₹${grandTotal.toLocaleString('en-IN')}`;
}

/* ==========================================================================
   WHATSAPP ORDER SUBMISSION (WhatsApp Number: 9842932756)
   ========================================================================== */
function submitWhatsAppOrder() {
    const company = document.getElementById('companyName').value.trim();
    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const gst = document.getElementById('custGst').value.trim();
    const address = document.getElementById('custAddress').value.trim();

    if (!company || !name || !phone || !address) {
        alert('Please fill in your Company Name, Contact Name, Phone, and Delivery Address.');
        return;
    }

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
    message += `💰 *TOTAL ESTIMATED RATE*: *₹${grandTotal.toLocaleString('en-IN')}*\n`;
    message += `====================================\n`;
    message += `Please confirm availability & dispatch transport details. Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
}

/* ==========================================================================
   OFFICIAL PDF ORDER INVOICE GENERATOR (jsPDF + AutoTable)
   ========================================================================== */
function generatePdfInvoice() {
    const company = document.getElementById('companyName').value.trim();
    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const gst = document.getElementById('custGst').value.trim();
    const address = document.getElementById('custAddress').value.trim();

    if (!company || !name || !phone || !address) {
        alert('Please fill in your Company Name, Contact Name, Phone, and Delivery Address before downloading PDF.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // 1. Header & Brand Title
    doc.setFillColor(1, 3, 86); // Royal Navy
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

    // 2. Invoice Meta & Customer Details
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
    doc.text(`Delivery Address: ${address}`, 15, 76);

    const today = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.setFont("helvetica", "bold");
    doc.text(`Order Date: ${today}`, 130, 45);
    doc.text(`Order Ref: GSC-ORD-${Date.now().toString().slice(-6)}`, 130, 52);
    doc.text(`Status: Pending Confirmation`, 130, 58);

    // 3. Itemized Table Data
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
                `${prod.title}\n[${prod.category}]`,
                `${qty} ${prod.unit.replace('per ', '')}s${pcsInfo}`,
                `₹${prod.baseRate.toLocaleString('en-IN')}`,
                `₹${subtotal.toLocaleString('en-IN')}`
            ]);
            index++;
        }
    });

    // Render Table
    doc.autoTable({
        startY: 85,
        head: [['S.No', 'Product Description', 'Quantity / Pack', 'Unit Rate (₹)', 'Subtotal Amount (₹)']],
        body: tableData,
        headStyles: {
            fillColor: [1, 3, 86],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
        },
        styles: {
            fontSize: 9,
            cellPadding: 4
        },
        columnStyles: {
            0: { cellWidth: 15, halign: 'center' },
            1: { cellWidth: 80 },
            2: { cellWidth: 35, halign: 'center' },
            3: { cellWidth: 30, halign: 'right' },
            4: { cellWidth: 30, halign: 'right' }
        }
    });

    const finalY = doc.lastAutoTable.finalY + 10;

    // 4. Total Calculation Box
    doc.setFillColor(248, 250, 252);
    doc.rect(120, finalY, 75, 20, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(120, finalY, 75, 20, 'D');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(1, 3, 86);
    doc.text("TOTAL ESTIMATED:", 125, finalY + 12);
    
    doc.setTextColor(37, 132, 2); // Emerald Green
    doc.setFontSize(13);
    doc.text(`₹${grandTotal.toLocaleString('en-IN')}`, 165, finalY + 12);

    // 5. Footer & Instructions
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("Note: This is an automated Order Inquiry Invoice generated by Govindasamy & Co.", 15, finalY + 30);
    doc.text("Please share this PDF or order details to WhatsApp: +91 98429 32756 for payment & lorry transport confirmation.", 15, finalY + 35);

    // Save PDF
    doc.save(`Govindasamy_Mat_Order_${company.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
}
