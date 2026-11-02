import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import API from "../api";
import {
  Truck,
  Plus,
  Trash2,
  CheckCircle2,
  History,
  ShoppingBag,
  Building2
} from "lucide-react";

const Purchases = () => {
  const [supplier, setSupplier] = useState("");
  const [items, setItems] = useState([]);
  const [purchaseList, setPurchaseList] = useState([]);
  const [saving, setSaving] = useState(false);

  const addItem = () => {
    setItems([...items, { productName: "", quantity: 1, cost: 0 }]);
  };

  const removeItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const fetchPurchases = async () => {
    try {
      const res = await API.get("/purchases");
      setPurchaseList(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const createPurchase = async () => {
    if (!supplier || items.length === 0) {
      alert("Please provide the supplier name and add at least one line item.");
      return;
    }

    setSaving(true);
    try {
      await API.post("/purchases", {
        supplier,
        items
      });

      setSupplier("");
      setItems([]);
      fetchPurchases();
      alert("Purchase recorded successfully! Inventory stock has been updated.");
    } catch (err) {
      alert("Failed to record purchase. Please verify details.");
    } finally {
      setSaving(false);
    }
  };

  const calculateTotal = () => {
    return items.reduce((acc, it) => acc + (it.quantity * it.cost), 0);
  };

  return (
    <Layout>
      {/* RECORD PURCHASE ORDER */}
      <div className="modern-content-card">
        <div className="card-top-bar">
          <div className="card-title-group">
            <Truck size={18} className="card-header-icon" />
            <h3 className="card-headline">Record Inbound Purchase (Stock Intake)</h3>
          </div>
          <span className="badge badge-success">Inventory Reorder</span>
        </div>

        <div className="form-grid-3" style={{ marginBottom: 20 }}>
          <div className="form-field-group" style={{ gridColumn: "span 2" }}>
            <label>Vendor / Supplier Name *</label>
            <div className="input-with-icon">
              <Building2 size={15} className="input-prefix-icon" />
              <input
                placeholder="e.g. Apex Electronics Ltd, Metro Distributors"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
              />
            </div>
          </div>

          <div className="form-field-group" style={{ display: "flex", alignItems: "flex-end" }}>
            <button
              type="button"
              className="btn-modern-ghost"
              onClick={addItem}
              style={{ width: "100%", justifyContent: "center" }}
            >
              <Plus size={15} />
              <span>Add Purchase Item</span>
            </button>
          </div>
        </div>

        {/* Purchase Items List */}
        <div className="invoice-items-section">
          {items.map((item, index) => (
            <div key={index} className="invoice-line-row">
              <div className="line-item-col" style={{ flex: 3 }}>
                <input
                  placeholder="Product Name / Model"
                  value={item.productName}
                  onChange={(e) => updateItem(index, "productName", e.target.value)}
                  className="modern-input"
                />
              </div>

              <div className="line-item-col col-qty">
                <input
                  type="number"
                  placeholder="Qty"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, "quantity", Number(e.target.value))}
                  className="modern-input"
                />
              </div>

              <div className="line-item-col" style={{ flex: 2 }}>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Cost Price (₹)"
                  value={item.cost}
                  onChange={(e) => updateItem(index, "cost", Number(e.target.value))}
                  className="modern-input"
                />
              </div>

              <div className="line-item-col col-total">
                <span className="total-readout">
                  ₹{(item.quantity * item.cost).toFixed(2)}
                </span>
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
              <ShoppingBag size={24} />
              <p>No inventory items listed. Click to add products received from the supplier.</p>
            </div>
          )}

          {items.length > 0 && (
            <div className="invoice-summary-bar">
              <div className="summary-left-info">
                <span>Total Items: {items.length} product entries</span>
              </div>
              <div className="summary-right-totals">
                <div className="grand-total-display">
                  <span className="total-label">Total Cost:</span>
                  <span className="total-figure">₹{calculateTotal().toFixed(2)}</span>
                </div>
                <button
                  type="button"
                  className="btn-modern-primary"
                  onClick={createPurchase}
                  disabled={saving}
                >
                  <CheckCircle2 size={16} />
                  <span>{saving ? "Saving & Updating Stock..." : "Save Purchase & Update Stock"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PURCHASE HISTORY TABLE */}
      <div className="modern-content-card" style={{ marginTop: 24 }}>
        <div className="card-top-bar">
          <div className="card-title-group">
            <History size={18} className="card-header-icon" />
            <h3 className="card-headline">Purchase History ({purchaseList.length} orders)</h3>
          </div>
        </div>

        <div className="modern-table-responsive">
          <table className="modern-data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Supplier</th>
                <th>Purchased Items</th>
                <th>Total Cost</th>
                <th style={{ textAlign: "right" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {purchaseList.map((p) => (
                <tr key={p._id}>
                  <td>{new Date(p.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                  <td>
                    <strong>{p.supplier}</strong>
                  </td>
                  <td>
                    <div className="purchased-items-tags">
                      {p.items.map((it, idx) => (
                        <span key={idx} className="category-pill">
                          {it.productName} × {it.quantity}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span className="price-tag">₹{p.totalCost.toFixed(2)}</span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <span className="status-badge badge-success">● Received</span>
                  </td>
                </tr>
              ))}
              {purchaseList.length === 0 && (
                <tr>
                  <td colSpan="5" className="table-empty-message">
                    No supplier purchase orders logged yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Purchases;
