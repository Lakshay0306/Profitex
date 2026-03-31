import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../api";

const Products = () => {

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    quantity: "",
    price: "",
    gst: "",
    supplier: ""
  });

  const fetchProducts = async () => {
    try {
      const { data } = await API.get("/products");
      setProducts(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/products", form);

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

  return (
    <Layout>

      <h2 style={{marginBottom:"20px"}}>Products</h2>

      {/* ADD PRODUCT FORM */}

      <div className="invoice-card">

        <h3>Add Product</h3>

        <form onSubmit={submit}>

          <input
            placeholder="Product Name"
            value={form.name}
            onChange={(e)=>setForm({...form,name:e.target.value})}
          />

          <input
            placeholder="Category"
            value={form.category}
            onChange={(e)=>setForm({...form,category:e.target.value})}
          />

          <input
            type="number"
            placeholder="Quantity"
            value={form.quantity}
            onChange={(e)=>setForm({...form,quantity:e.target.value})}
          />

          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e)=>setForm({...form,price:e.target.value})}
          />

          <input
            type="number"
            placeholder="GST %"
            value={form.gst}
            onChange={(e)=>setForm({...form,gst:e.target.value})}
          />

          <input
            placeholder="Supplier"
            value={form.supplier}
            onChange={(e)=>setForm({...form,supplier:e.target.value})}
          />

          <button className="btn-primary">Add Product</button>

        </form>

      </div>

      {/* PRODUCTS TABLE */}

      <div className="invoice-card">

        <h3>Product Inventory</h3>

        <table className="table">

          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Price</th>
              <th>GST</th>
              <th>Supplier</th>
            </tr>
          </thead>

          <tbody>

            {products.map((p)=>(
              <tr key={p._id}>

                <td>{p.name}</td>

                <td>{p.category}</td>

                <td>
                  <span className={p.quantity < 5 ? "low-stock" : "in-stock"}>
                    {p.quantity}
                  </span>
                </td>

                <td>₹ {p.price}</td>

                <td>{p.gst}%</td>

                <td>{p.supplier}</td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </Layout>
  );
};

export default Products;