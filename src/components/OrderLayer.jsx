import React, { useState } from 'react';
import { db, collection, addDoc, serverTimestamp } from '../firebase';
import { calculateMasterPacks } from '../utils/packetEngine';
import { generatePdfInvoice } from '../utils/pdfGenerator';

const WHATSAPP_NUMBER = '919842932756';

export default function OrderLayer({
  isOpen,
  onClose,
  selectedProductIds,
  products,
  itemQuantities,
  onUpdateQty,
  onRemoveItem
}) {
  const [company, setCompany] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gst, setGst] = useState('');
  const [address, setAddress] = useState('');

  const packInfo = calculateMasterPacks(selectedProductIds, products, itemQuantities);

  let grandTotal = 0;
  let totalUnits = 0;

  selectedProductIds.forEach((id) => {
    const prod = products.find((p) => p.id === id);
    const qty = itemQuantities[id] || 1;
    if (prod) {
      totalUnits += qty;
      grandTotal += prod.baseRate * qty;
    }
  });

  const handleWhatsAppSubmit = async () => {
    if (selectedProductIds.length === 0) {
      alert('Please select at least 1 mat item before sending order.');
      return;
    }
    if (!company || !name || !phone || !address) {
      alert('Please fill in your Company Name, Contact Name, Phone, and Delivery Address.');
      return;
    }

    // Save order in Firestore
    try {
      await addDoc(collection(db, 'orders'), {
        companyName: company,
        contactPerson: name,
        phone,
        gstNo: gst,
        address,
        estBales: packInfo.estPacks,
        status: 'PENDING_CONFIRMATION',
        createdAt: serverTimestamp(),
        items: selectedProductIds.map((id) => {
          const prod = products.find((p) => p.id === id);
          return {
            title: prod.title,
            category: prod.category,
            qty: itemQuantities[id] || 1,
            unitRate: prod.baseRate
          };
        })
      });
    } catch (err) {
      console.warn('Firestore order record warning:', err);
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

    let index = 1;
    selectedProductIds.forEach((id) => {
      const prod = products.find((p) => p.id === id);
      const qty = itemQuantities[id] || 1;
      if (prod) {
        const subtotal = prod.baseRate * qty;
        message += `${index}. *${prod.title}*\n`;
        message += `   - Category: ${prod.category}\n`;
        message += `   - Quantity: *${qty} ${prod.unit.replace('per ', '')}(s)*\n`;
        if (prod.bundlePieces > 0) {
          message += `   - Total Pcs: (${qty * prod.bundlePieces} pieces)\n`;
        }
        message += `   - Rate: Rs. ${prod.baseRate.toLocaleString('en-IN')} / ${prod.unit.replace('per ', '')}\n`;
        message += `   - Subtotal: *Rs. ${subtotal.toLocaleString('en-IN')}*\n\n`;
        index++;
      }
    });

    message += `====================================\n`;
    message += `📦 *ESTIMATED MASTER BALES*: *${packInfo.estPacks} Bales/Packs*\n`;
    message += `💰 *TOTAL ESTIMATED RATE*: *Rs. ${grandTotal.toLocaleString('en-IN')}*\n`;
    message += `====================================\n`;
    message += `Please confirm availability & dispatch transport details. Thank you!`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleDownloadPdf = () => {
    if (selectedProductIds.length === 0) {
      alert('Please select at least 1 mat item before downloading PDF invoice.');
      return;
    }
    generatePdfInvoice({
      company,
      name,
      phone,
      gst,
      address,
      selectedProductIds,
      products,
      itemQuantities,
      packInfo
    });
  };

  return (
    <>
      <div className={`layer-backdrop ${isOpen ? '' : 'hidden'}`} onClick={onClose}></div>

      <aside className={`separate-order-layer ${isOpen ? 'layer-open' : ''}`}>
        <div className="layer-content-card">
          <div className="layer-header">
            <div className="layer-title-group">
              <i className="fa-solid fa-file-invoice-dollar"></i>
              <div>
                <h3>Wholesale Purchase Order</h3>
                <span className="layer-subtitle">Review items, fill company details & export order</span>
              </div>
            </div>
            <button type="button" className="btn-close-layer" onClick={onClose} title="Close Order Form">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div className="layer-body">
            {/* Section 1: Selected Items & Quantities */}
            <div className="section-block">
              <div className="section-title">
                <i className="fa-solid fa-list-check"></i>
                <h4>1. Selected Items & Quantities</h4>
              </div>
              <div className="selected-items-container">
                {selectedProductIds.length === 0 ? (
                  <div className="empty-selection-notice">
                    <i className="fa-solid fa-hand-pointer"></i>
                    <p>No items selected yet</p>
                    <span>Click <strong>"Select Item"</strong> on any mat card to build your wholesale order!</span>
                  </div>
                ) : (
                  selectedProductIds.map((id) => {
                    const prod = products.find((p) => p.id === id);
                    if (!prod) return null;
                    const qty = itemQuantities[id] || 1;

                    return (
                      <div key={id} className="side-item-row">
                        <div className="side-item-info">
                          <div className="side-item-title">{prod.title}</div>
                          <div className="side-item-rate">
                            Rs. {prod.baseRate.toLocaleString('en-IN')} / {prod.unit.replace('per ', '')}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <input
                            type="number"
                            className="side-qty-input"
                            value={qty}
                            min="1"
                            onChange={(e) => onUpdateQty(id, parseInt(e.target.value) || 1)}
                          />
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                            {prod.unit.replace('per ', '')}(s)
                          </span>
                          <button type="button" className="btn-remove-side" onClick={() => onRemoveItem(id)} title="Remove item">
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Section 2: Business & Contact Form */}
            <div className="section-block">
              <div className="section-title">
                <i className="fa-solid fa-building-columns"></i>
                <h4>2. Business & Contact Information</h4>
              </div>

              <div className="form-group">
                <label><i className="fa-solid fa-briefcase"></i> Company / Shop Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Sri Lakshmi Textiles & Mat Stores"
                  required
                />
              </div>

              <div className="form-group">
                <label><i className="fa-solid fa-user-tie"></i> Contact Person Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mr. K. Ramesh"
                  required
                />
              </div>

              <div className="form-group">
                <label><i className="fa-solid fa-phone"></i> WhatsApp / Phone Number *</label>
                <input
                  type="tel"
                  className="form-control"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9842932756"
                  required
                />
              </div>

              <div className="form-group">
                <label><i className="fa-solid fa-id-card"></i> GST Number (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  value={gst}
                  onChange={(e) => setGst(e.target.value)}
                  placeholder="e.g. 33AAAAA0000A1Z5"
                />
              </div>

              <div className="form-group">
                <label><i className="fa-solid fa-location-dot"></i> Delivery Address & Lorry Transport City *</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Full street address, city, landmark & preferred lorry transport service..."
                  required
                ></textarea>
              </div>
            </div>

            {/* Section 3: Summary & Packet Calc */}
            <div className="side-summary-card">
              <div className="summary-line">
                <span>Selected Products:</span>
                <strong>{selectedProductIds.length} Items</strong>
              </div>
              <div className="summary-line">
                <span>Total Ordered Quantity:</span>
                <strong>{totalUnits} Units</strong>
              </div>

              <div className="summary-line packet-calc-line">
                <span><i className="fa-solid fa-boxes-packing"></i> Est. Master Bales / Packs:</span>
                <strong className="packet-val">{packInfo.estPacks} Master {packInfo.estPacks === 1 ? 'Bale' : 'Bales'}</strong>
              </div>

              <div className="summary-line grand-total-line">
                <span>Total Estimated Amount:</span>
                <strong className="grand-total">Rs. {grandTotal.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            {/* Section 4: Action Buttons */}
            <div className="side-action-buttons">
              <button type="button" className="btn btn-whatsapp-action" onClick={handleWhatsAppSubmit}>
                <i className="fa-brands fa-whatsapp" style={{ fontSize: '1.4rem' }}></i> Send Order via WhatsApp
              </button>
              <button type="button" className="btn btn-pdf-action" onClick={handleDownloadPdf}>
                <i className="fa-solid fa-file-pdf"></i> Download PDF Order Invoice
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
