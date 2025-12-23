const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let orders = [];

// Health check
app.get("/", (req, res) => {
  res.send("Luxury Store Backend is running");
});

// Create order
app.post("/create-order", (req, res) => {
  const order = {
    id: "ORD-" + Date.now(),
    customer: req.body.customer,
    cart: req.body.cart,
    total: req.body.total,
    gst: req.body.gst || null,
    createdAt: new Date().toISOString(),
    status: "CREATED"
  };

  orders.push(order);

  res.json({
    success: true,
    orderId: order.id
  });
});

// View all orders (for now)
app.get("/orders", (req, res) => {
  res.json(orders);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Backend running on port " + PORT);
});
