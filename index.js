import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// main route
app.get("/", (req, res) => {
  res.send("hello developer");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ebf9ofi.mongodb.net/?appName=Cluster0`;

if (!uri) {
  console.error(" MONGODB_URI is not defined in environment variables");
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let addPetCollection;
let orderCollection;
let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  await client.connect();
  const pawmartdb = client.db("pawmartdb");
  addPetCollection = pawmartdb.collection("addproducts");
  orderCollection = pawmartdb.collection("order");
  isConnected = true;
  console.log("✅ Connected to MongoDB");
}

// ====== Routes ======

// add product
app.post("/addproducts", async (req, res) => {
  try {
    await connectDB();
    const data = req.body;
    const result = await addPetCollection.insertOne(data);
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to add product" });
  }
});

// get products (with optional category)
app.get("/addproducts", async (req, res) => {
  try {
    await connectDB();
    const { category } = req.query;
    const query = {};

    if (category && category !== "All") {
      query.category = category;
    }

    const result = await addPetCollection.find(query).toArray();
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to fetch products" });
  }
});

// single product by id
app.get("/addproducts/:id", async (req, res) => {
  try {
    await connectDB();
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await addPetCollection.findOne(query);
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to fetch product" });
  }
});

// my services (by email)
app.get("/my-services", async (req, res) => {
  try {
    await connectDB();
    const email = req.query.email;
    const query = { email };
    const result = await addPetCollection.find(query).toArray();
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to fetch services" });
  }
});

// update product
app.put("/updatepage/:id", async (req, res) => {
  try {
    await connectDB();
    const id = req.params.id;
    const data = req.body;
    const query = { _id: new ObjectId(id) };
    const updateData = { $set: data };
    const result = await addPetCollection.updateOne(query, updateData);
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to update product" });
  }
});

// delete product  আগের bug: req.params -> এখন req.params.id
app.delete("/delete/:id", async (req, res) => {
  try {
    await connectDB();
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await addPetCollection.deleteOne(query);
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to delete product" });
  }
});

// order create
app.post("/orders", async (req, res) => {
  try {
    await connectDB();
    const data = req.body;
    const result = await orderCollection.insertOne(data);
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to create order" });
  }
});

// get orders (optionally by buyer email)
app.get("/orders", async (req, res) => {
  try {
    await connectDB();
    const email = req.query.email;
    let query = {};
    if (email) {
      query = { buyerEmail: email };
    }
    const result = await orderCollection.find(query).toArray();
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to fetch orders" });
  }
});

//Vercel-এ app.listen লাগবে না
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`server is running ${PORT}`);
// });

// Vercel-এর জন্য express app-টাই handler হিসেবে export করো
export default app;
