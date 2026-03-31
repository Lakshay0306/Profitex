import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../api";

const Invoices = () => {

  const [products,setProducts] = useState([]);
  const [items,setItems] = useState([]);
  const [customerName,setCustomerName] = useState("");
  const [invoices,setInvoices] = useState([]);

  useEffect(()=>{
    fetchProducts();
    fetchInvoices();
  },[]);

  const fetchProducts = async ()=>{
    const {data} = await API.get("/products");
    setProducts(data);
  };

  const fetchInvoices = async ()=>{
    const {data} = await API.get("/invoices");
    setInvoices(data);
  };

  const addItem = ()=>{
    setItems([...items,{
      productId:"",
      quantity:1,
      price:0,
      gst:0,
      total:0
    }]);
  };

  const updateItem = (index,field,value)=>{
    const updated=[...items];
    updated[index][field]=value;

    if(field==="productId"){
      const selected = products.find(p=>p._id===value);

      updated[index].price = selected.price;
      updated[index].gst = selected.gst;
    }

    const subtotal = updated[index].quantity * updated[index].price;
    const gstAmount = subtotal * (updated[index].gst/100);

    updated[index].total = subtotal + gstAmount;

    setItems(updated);
  };

  const grandTotal = items.reduce((sum,i)=>sum+i.total,0);

  const createInvoice = async ()=>{

    await API.post("/invoices",{
      customerName,
      items,
      grandTotal
    });

    setCustomerName("");
    setItems([]);

    fetchInvoices();
  };

  return (
    <Layout>

      <h2>Create Invoice</h2>

      <div className="invoice-card">

        <input
          placeholder="Customer Name"
          value={customerName}
          onChange={(e)=>setCustomerName(e.target.value)}
        />

        <button className="btn-secondary" onClick={addItem}>
          Add Product
        </button>

        {items.map((item,index)=>(
          <div key={index} style={{marginTop:"10px"}}>

            <select
              onChange={(e)=>updateItem(index,"productId",e.target.value)}
            >

              <option>Select Product</option>

              {products.map(p=>(
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}

            </select>

            <input
              type="number"
              value={item.quantity}
              onChange={(e)=>updateItem(index,"quantity",Number(e.target.value))}
            />

            <span>Price: ₹ {item.price}</span>

            <span>GST: {item.gst}%</span>

            <span>Total: ₹ {item.total}</span>

          </div>
        ))}

        <h3>Grand Total: ₹ {grandTotal}</h3>

        <button className="btn-primary" onClick={createInvoice}>
          Generate Invoice
        </button>

      </div>

      <h3 style={{marginTop:"30px"}}>Recent Invoices</h3>

      {invoices.map(i=>(
        <div key={i._id} className="invoice-card">
          {i.customerName} — ₹{i.grandTotal}
        </div>
      ))}

    </Layout>
  );
};

export default Invoices;