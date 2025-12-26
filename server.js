console.log("🔥 SERVER.JS FILE LOADED");

const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

let ordersCollection;

async function startServer() {
  try {
    console.log("Attempting MongoDB connection...");

    const client = new MongoClient(MONGO_URL);
    await client.connect();

    const db = client.db("luxury_store");
    ordersCollection = db.collection("orders");

    console.log("✅ Connected to MongoDB");

    app.get("/", (req, res) => {
      res.send("Luxury Store Backend is running with MongoDB");
    });

    app.post("/create-order", async (req, res) => {
      const order = {
        id: "ORD-" + Date.now(),
        customer: req.body.customer,
        cart: req.body.cart,
        total: req.body.total,
        gst: req.body.gst || null,
        status: "CREATED",
        createdAt: new Date()
      };

      await ordersCollection.insertOne(order);

      res.json({
        success: true,
        orderId: order.id
      });
    });

    app.get("/orders", async (req, res) => {
      const orders = await ordersCollection.find({}).toArray();
      res.json(orders);
    });

    app.listen(PORT, () => {
      console.log("🚀 Backend running on port " + PORT);
    });

  } catch (err) {
    console.error("❌ MongoDB connection failed", err);
  }
}

startServer();
