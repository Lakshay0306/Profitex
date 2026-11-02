import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../api";
import {
  Receipt,
  Plus,
  Trash2,
  FileText,
  Mail,
  Download,
  Sparkles,
  CheckCircle2,
  X,
  CreditCard,
  User,
  Phone,
  AtSign
} from "lucide-react";

const Invoices = () => {
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [draftingId, setDraftingId] = useState(null);
  const [emailDraft, setEmailDraft] = useState(null);
  const [creatingInvoice, setCreatingInvoice] = useState(false);

  const draftEmail = async (invoice) => {
    setDraftingId(invoice._id);
    try {
      const { data } = await API.post("/ai/draft-email", {
        clientName: invoice.customerName,
        invoiceNumber: invoice.invoiceNumber,
        grandTotal: invoice.grandTotal,
        date: invoice.createdAt,
      });
      setEmailDraft(data);
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Failed to draft email with AI.");
    } finally {
      setDraftingId(null);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchInvoices();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await API.get("/products");
      setProducts(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchInvoices = async () => {
    try {
      const { data } = await API.get("/invoices");
      setInvoices(data);
    } catch (err) {
      console.log(err);
    }
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        productId: "",
        quantity: 1,
        price: 0,
        gst: 0,
        total: 0,
      },
    ]);
  };

  const removeItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;

    if (field === "productId") {
      const selected = products.find((p) => p._id === value);
      if (selected) {
        updated[index].price = selected.price;
        updated[index].gst = selected.gst || 0;
      }
    }

    const subtotal = updated[index].quantity * updated[index].price;
    const gstAmount = subtotal * (updated[index].gst / 100);

    updated[index].total = subtotal + gstAmount;

    setItems(updated);
  };

  const grandTotal = items.reduce((sum, i) => sum + i.total, 0);

  const createInvoice = async () => {
    if (!customerName || items.length === 0) {
      alert("Please enter customer name and add at least one product item.");
      return;
    }

    setCreatingInvoice(true);
    try {
      await API.post("/invoices", {
        customerName,
        customerPhone,
        customerEmail,
        items,
        grandTotal,
      });

      setCustomerName("");
      setCustomerPhone("");
      setCustomerEmail("");
      setItems([]);

      fetchInvoices();
      alert("Invoice generated and stock reconciled successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to generate invoice");
    } finally {
      setCreatingInvoice(false);
    }
  };

  const downloadPDF = async (id, invNumber) => {
    try {
      const response = await API.get(`/invoices/download/${id}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${invNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to download PDF invoice.");
    }
  };

  return (
    <Layout>
      {/* INVOICE BUILDER CARD */}
      <div className="modern-content-card">
        <div className="card-top-bar">
          <div className="card-title-group">
            <Receipt size={18} className="card-header-icon" />
            <h3 className="card-headline">Create New Tax Invoice</h3>
          </div>
          <span className="badge badge-success">GST Ready</span>
        </div>

        {/* Customer Information Row */}
        <div className="invoice-customer-grid">
          <div className="form-field-group">
            <label>Customer / Business Name *</label>
            <div className="input-with-icon">
              <User size={15} className="input-prefix-icon" />
              <input
                placeholder="e.g. Acme Enterprises, Rajesh Kumar"
                value={customerName}
                required
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
          </div>

          <div className="form-field-group">
            <label>Contact Phone</label>
            <div className="input-with-icon">
              <Phone size={15} className="input-prefix-icon" />
              <input
                placeholder="e.g. +91 98765 43210"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="form-field-group">
            <label>Email Address (for AI Dispatch)</label>
            <div className="input-with-icon">
              <AtSign size={15} className="input-prefix-icon" />
              <input
                placeholder="e.g. client@example.com"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Line Items Builder */}
        <div className="invoice-items-section">
          <div className="items-section-header">
            <h4>Invoice Line Items ({items.length})</h4>
            <button type="button" className="btn-modern-ghost" onClick={addItem}>
              <Plus size={15} />
              <span>Add Item</span>
            </button>
          </div>

          {items.map((item, index) => (
            <div key={index} className="invoice-line-row">
              <div className="line-item-col col-product">
                <label className="mobile-only-label">Product</label>
                <select
                  value={item.productId}
                  onChange={(e) => updateItem(index, "productId", e.target.value)}
                  className="modern-select"
                >
                  <option value="">Choose Product from Inventory...</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} (Stock: {p.quantity}) — ₹{p.price}
                    </option>
                  ))}
                </select>
              </div>

              <div className="line-item-col col-qty">
                <label className="mobile-only-label">Qty</label>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, "quantity", Number(e.target.value))}
                  className="modern-input"
                  placeholder="Qty"
                />
              </div>

              <div className="line-item-col col-price">
                <span className="price-readout">₹{item.price.toLocaleString()}</span>
              </div>

              <div className="line-item-col col-gst">
                <span className="gst-readout">{item.gst}% GST</span>
              </div>

              <div className="line-item-col col-total">
                <span className="total-readout">₹{item.total.toFixed(2)}</span>
              </div>

              <div className="line-item-col col-action">
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="line-delete-btn"
                  title="Remove Item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="empty-line-items" onClick={addItem}>
              <Plus size={24} />
              <p>No products added to this invoice yet. Click here to add an item.</p>
            </div>
          )}

          {/* Invoice Summary and CTA */}
          {items.length > 0 && (
            <div className="invoice-summary-bar">
              <div className="summary-left-info">
                <CreditCard size={18} />
                <span>Inventory quantities will be deducted automatically upon invoice creation.</span>
              </div>
              <div className="summary-right-totals">
                <div className="grand-total-display">
                  <span className="total-label">Grand Total:</span>
                  <span className="total-figure">₹{grandTotal.toFixed(2)}</span>
                </div>
                <button
                  type="button"
                  className="btn-modern-primary btn-generate-invoice"
                  onClick={createInvoice}
                  disabled={creatingInvoice}
                >
                  <CheckCircle2 size={16} />
                  <span>{creatingInvoice ? "Saving & Deducting Stock..." : "Generate & Finalize Invoice"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RECENT INVOICES DIRECTORY */}
      <div className="modern-content-card" style={{ marginTop: 24 }}>
        <div className="card-top-bar">
          <div className="card-title-group">
            <FileText size={18} className="card-header-icon" />
            <h3 className="card-headline">Recent Billing Invoices ({invoices.length})</h3>
          </div>
        </div>

        <div className="modern-table-responsive">
          <table className="modern-data-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Client / Customer</th>
                <th>Creation Date</th>
                <th>Total Value</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv._id}>
                  <td>
                    <span className="invoice-num-tag">{inv.invoiceNumber}</span>
                  </td>
                  <td>
                    <strong>{inv.customerName}</strong>
                    {inv.customerPhone && (
                      <span className="sub-phone">{inv.customerPhone}</span>
                    )}
                  </td>
                  <td>{new Date(inv.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                  <td>
                    <span className="price-tag">₹{inv.grandTotal.toFixed(2)}</span>
                  </td>
                  <td>
                    <span className="status-badge badge-success">● Generated</span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div className="table-action-buttons">
                      <button
                        className="btn-table-action btn-action-pdf"
                        onClick={() => downloadPDF(inv._id, inv.invoiceNumber)}
                        title="Download PDF Invoice"
                      >
                        <Download size={13} />
                        <span>PDF</span>
                      </button>
                      <button
                        className="btn-table-action btn-action-ai"
                        onClick={() => draftEmail(inv)}
                        disabled={draftingId === inv._id}
                        title="Draft Context-Aware Email with Gemini AI"
                      >
                        <Sparkles size={13} />
                        <span>{draftingId === inv._id ? "Drafting..." : "AI Email"}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan="6" className="table-empty-message">
                    No invoices recorded in the system yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI EMAIL DRAFT MODAL */}
      {emailDraft && (
        <div className="modal-backdrop-blur" onClick={() => setEmailDraft(null)}>
          <div className="modern-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top-bar">
              <div className="modal-title-group">
                <Sparkles size={18} className="ai-modal-icon" />
                <h3>Gemini AI Context-Aware Email Draft</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setEmailDraft(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body-content">
              <div className="modal-field-preview">
                <span className="preview-label">Subject:</span>
                <span className="preview-subject-value">{emailDraft.subject}</span>
              </div>
              <div className="modal-field-preview">
                <span className="preview-label">Body Content:</span>
                <textarea
                  readOnly
                  value={emailDraft.body}
                  className="modal-email-textarea"
                />
              </div>
            </div>

            <div className="modal-footer-bar">
              <button
                className="btn-modern-ghost"
                onClick={() => {
                  navigator.clipboard.writeText(`${emailDraft.subject}\n\n${emailDraft.body}`);
                  alert("Email copied to clipboard!");
                }}
              >
                Copy to Clipboard
              </button>
              <button
                className="btn-modern-primary"
                onClick={() => setEmailDraft(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Invoices;
