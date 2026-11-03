import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../api";
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  TrendingUp,
  Coins,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Boxes
} from "lucide-react";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    quantity: "",
    price: "",
    gst: "",
    supplier: ""
  });

  const [aiDemand, setAiDemand] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiPricing, setAiPricing] = useState(null);
  const [loadingPricing, setLoadingPricing] = useState(false);

  const fetchProducts = async () => {
    try {
      const { data } = await API.get("/products");
      setProducts(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchDemand = async () => {
    setLoadingAi(true);
    try {
      const { data } = await API.get("/ai/predict-demand");
      if (Array.isArray(data)) {
        setAiDemand(data);
      }
    } catch (err) {
      console.error("Demand prediction error:", err);
    } finally {
      setLoadingAi(false);
    }
  };

  const fetchPricing = async () => {
    setLoadingPricing(true);
    try {
      const { data } = await API.get("/ai/optimize-pricing");
      if (Array.isArray(data)) {
        setAiPricing(data);
      }
    } catch (err) {
      console.error("Pricing optimization error:", err);
    } finally {
      setLoadingPricing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await API.put(`/products/${editId}`, form);
        setIsEditing(false);
        setEditId(null);
      } else {
        await API.post("/products", form);
      }

      setForm({
        name: "",
        category: "",
        quantity: "",
        price: "",
        gst: "",
        supplier: ""
      });

      fetchProducts();
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name,
      category: p.category || "",
      quantity: p.quantity,
      price: p.price,
      gst: p.gst || 0,
      supplier: p.supplier || ""
    });
    setIsEditing(true);
    setEditId(p._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await API.delete(`/products/${id}`);
        fetchProducts();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];
  const lowStockCount = products.filter((p) => p.quantity < 5).length;

  return (
    <Layout>
      {/* LOW STOCK ALERT BANNER */}
      {lowStockCount > 0 && (
        <div className="modern-alert-banner alert-danger">
          <AlertTriangle size={18} className="alert-icon" />
          <div className="alert-content">
            <span className="alert-title">Critical Inventory Warning</span>
            <span className="alert-desc">
              {lowStockCount} product{lowStockCount > 1 ? "s are" : " is"} running below safe buffer (Stock &lt; 5 units). Prompt restocking recommended.
            </span>
          </div>
        </div>
      )}

      {/* AI INTELLIGENCE ROW */}
      <div className="ai-features-grid">
        {/* AI Demand Prediction Card */}
        <div className="ai-feature-card ai-feature-demand">
          <div className="feature-card-header">
            <div className="feature-header-left">
              <div className="feature-icon-badge demand-badge">
                <TrendingUp size={18} />
              </div>
              <div>
                <h4 className="feature-title">AI Demand Prediction</h4>
                <p className="feature-subtitle">Run-rate heuristics & stockout prevention</p>
              </div>
            </div>
            <button
              onClick={fetchDemand}
              disabled={loadingAi}
              className="feature-action-btn btn-demand"
            >
              <RefreshCw size={14} className={loadingAi ? "spin-animation" : ""} />
              <span>{loadingAi ? "Calculating..." : "Run Prediction"}</span>
            </button>
          </div>

          {aiDemand && aiDemand.length > 0 && (
            <div className="feature-chips-container">
              {aiDemand.map((item, i) => (
                <div key={i} className="ai-suggestion-chip chip-demand">
                  <div className="chip-product-name">{item.productName}</div>
                  <div className="chip-reason-text">{item.reason}</div>
                  <div className="chip-metric-tag tag-demand">
                    Recommended Order: <strong>+{item.recommendedOrder} units</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Pricing Optimization Card */}
        <div className="ai-feature-card ai-feature-pricing">
          <div className="feature-card-header">
            <div className="feature-header-left">
              <div className="feature-icon-badge pricing-badge">
                <Coins size={18} />
              </div>
              <div>
                <h4 className="feature-title">AI Pricing Optimization</h4>
                <p className="feature-subtitle">Elasticity & gross margin maximizer</p>
              </div>
            </div>
            <button
              onClick={fetchPricing}
              disabled={loadingPricing}
              className="feature-action-btn btn-pricing"
            >
              <Sparkles size={14} className={loadingPricing ? "spin-animation" : ""} />
              <span>{loadingPricing ? "Optimizing..." : "Optimize Rates"}</span>
            </button>
          </div>

          {aiPricing && aiPricing.length > 0 && (
            <div className="feature-chips-container">
              {aiPricing.map((item, i) => (
                <div key={i} className="ai-suggestion-chip chip-pricing">
                  <div className="chip-product-name">{item.productName}</div>
                  <div className="chip-reason-text">{item.reason}</div>
                  <div className="chip-metric-tag tag-pricing">
                    Price: ₹{item.currentPrice} → <strong>₹{item.recommendedPrice}</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ADD / EDIT PRODUCT FORM */}
      <div className="modern-content-card">
        <div className="card-top-bar">
          <div className="card-title-group">
            <Package size={18} className="card-header-icon" />
            <h3 className="card-headline">{isEditing ? "Edit Product Details" : "Add New Inventory Item"}</h3>
          </div>
          {isEditing && (
            <span className="badge badge-warning">Editing Mode Active</span>
          )}
        </div>

        <form onSubmit={submit} className="modern-form">
          <div className="form-grid-3">
            <div className="form-field-group">
              <label>Product Title / Model *</label>
              <input
                placeholder="e.g. Dell XPS 15, Parle-G Biscuit"
                value={form.name}
                required
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="form-field-group">
              <label>Category</label>
              <input
                placeholder="e.g. Electronics, Groceries"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>

            <div className="form-field-group">
              <label>Quantity in Stock *</label>
              <input
                type="number"
                placeholder="e.g. 50"
                value={form.quantity}
                required
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              />
            </div>

            <div className="form-field-group">
              <label>Selling Price (₹) *</label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g. 899.00"
                value={form.price}
                required
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>

            <div className="form-field-group">
              <label>GST Rate (%)</label>
              <input
                type="number"
                placeholder="e.g. 18"
                value={form.gst}
                onChange={(e) => setForm({ ...form, gst: e.target.value })}
              />
            </div>

            <div className="form-field-group">
              <label>Vendor / Supplier</label>
              <input
                placeholder="e.g. ABC Wholesalers Pvt Ltd"
                value={form.supplier}
                onChange={(e) => setForm({ ...form, supplier: e.target.value })}
              />
            </div>
          </div>

          <div className="form-action-row">
            <button type="submit" className="btn-modern-primary">
              {isEditing ? <CheckCircle2 size={16} /> : <Plus size={16} />}
              <span>{isEditing ? "Update Product" : "Save to Inventory"}</span>
            </button>
            {isEditing && (
              <button
                type="button"
                className="btn-modern-ghost"
                onClick={() => {
                  setIsEditing(false);
                  setEditId(null);
                  setForm({ name: "", category: "", quantity: "", price: "", gst: "", supplier: "" });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* PRODUCTS DIRECTORY TABLE */}
      <div className="modern-content-card">
        <div className="card-top-bar table-toolbar">
          <div className="card-title-group">
            <Boxes size={18} className="card-header-icon" />
            <h3 className="card-headline">Inventory Directory ({filteredProducts.length} items)</h3>
          </div>

          <div className="table-filter-group">
            <div className="table-search-box">
              <Search size={15} className="table-search-icon" />
              <input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="table-select-box">
              <Filter size={15} className="table-filter-icon" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="modern-table-responsive">
          <table className="modern-data-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Stock Status</th>
                <th>Unit Price</th>
                <th>GST Rate</th>
                <th>Supplier</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => {
                let stockBadge = <span className="status-badge badge-success">● {p.quantity} In Stock</span>;
                if (p.quantity < 5) {
                  stockBadge = <span className="status-badge badge-danger">● {p.quantity} Low Stock</span>;
                } else if (p.quantity < 15) {
                  stockBadge = <span className="status-badge badge-warning">● {p.quantity} Moderate</span>;
                }

                return (
                  <tr key={p._id}>
                    <td>
                      <div className="product-cell-name">
                        <strong>{p.name}</strong>
                      </div>
                    </td>
                    <td>
                      <span className="category-pill">{p.category || "General"}</span>
                    </td>
                    <td>{stockBadge}</td>
                    <td>
                      <span className="price-tag">₹{p.price.toLocaleString()}</span>
                    </td>
                    <td>{p.gst || 0}%</td>
                    <td>{p.supplier || "—"}</td>
                    <td style={{ textAlign: "right" }}>
                      <div className="table-action-buttons">
                        <button
                          onClick={() => handleEdit(p)}
                          className="action-icon-btn edit-btn"
                          title="Edit Product"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="action-icon-btn delete-btn"
                          title="Delete Product"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="7" className="table-empty-message">
                    No products matching your search criteria.
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

export default Products;
