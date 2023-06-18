const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
// const admin = require("firebase-admin");
const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ebhzh.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const dbConnect = async () => {
  try {
    client.connect();
    console.log(" Database Connected Successfully✅ ");
  } catch (error) {
    console.log(error.name, error.message);
  }
};
dbConnect();

// await client.connect();
const database = client.db("photography");
const galleryCollection = database.collection("gallery");
const photoCollection = database.collection("photos");
const cinemaCollection = database.collection("cinemas");
const addonCollection = database.collection("addons");
const productCollection = database.collection("products");
const ordersCollection = database.collection("orders");
const usersCollection = database.collection("users");
const reviewCollection = database.collection("reviews");

app.get("/gallery", async (req, res) => {
  const cursor = galleryCollection.find({});
  const gallery = await cursor.toArray();
  res.send(gallery);
});
app.get("/photos", async (req, res) => {
  const cursor = photoCollection.find({});
  const photos = await cursor.toArray();
  res.send(photos);
});
app.get("/cinemas", async (req, res) => {
  const cursor = cinemaCollection.find({});
  const cinemas = await cursor.toArray();
  res.send(cinemas);
});
app.get("/addons", async (req, res) => {
  const cursor = addonCollection.find({});
  const addon = await cursor.toArray();
  res.send(addon);
});
app.get("/products", async (req, res) => {
  const cursor = productCollection.find({});
  const products = await cursor.toArray();
  res.send(products);
});

app.get("/orders", async (req, res) => {
  const cursor = ordersCollection.find({});
  const orders = await cursor.toArray();
  res.send(orders);
});

app.post("/orders", async (req, res) => {
  const order = req.body;
  const result = await ordersCollection.insertOne(order);
  res.json(result);
});
//GET USERS API
app.get("/users", async (req, res) => {
  const cursor = usersCollection.find({});
  const users = await cursor.toArray();
  res.send(users);
});
//POST USERS API
app.post("/users", async (req, res) => {
  const users = req.body;
  const result = await usersCollection.insertOne(users);
  res.json(result);
});

//PUT USERS API
app.put("/users", async (req, res) => {
  const user = req.body;
  const filter = { email: user.email };
  const options = { upsert: true };
  const updateDoc = { $set: user };
  const result = await usersCollection.updateOne(filter, updateDoc, options);
  res.json(result);
});
//PUT ADMIN API
app.put("/users/admin", async (req, res) => {
  const user = req.body;

  console.log(user);
  const filter = { email: user.email };
  const updateDoc = { $set: { role: "admin" } };
  const result = await usersCollection.updateOne(filter, updateDoc);
  res.json(result);
});
//GET ADMIN API
app.get("/users/:email", async (req, res) => {
  const email = req.params.email;
  const query = { email: email };
  const user = await usersCollection.findOne(query);
  let isAdmin = false;
  if (user?.role === "admin") {
    isAdmin = true;
  }
  res.json({ admin: isAdmin });
});

//GET REVIEWS API
app.get("/reviews", async (req, res) => {
  const cursor = reviewCollection.find({});
  const reviews = await cursor.toArray();
  res.send(reviews);
});
app.get("/home/reviews", async (req, res) => {
  const cursor = reviewCollection.find({}).limit(5);
  const reviews = await cursor.toArray();
  res.send(reviews);
});

app.delete("/orders/:id", async (req, res) => {
  const id = req.params.id;
  // console.log(id)
  const query = { _id: ObjectId(id) };
  const result = await ordersCollection.deleteOne(query);
  // console.log(result)
  res.json(result);
});

//POST REVIEWS API
app.post("/reviews", async (req, res) => {
  const review = req.body;
  console.log(review);
  const result = await reviewCollection.insertOne(review);
  res.json(result);
});

//UPDATE STATUS
app.put("/orders/:id", async (req, res) => {
  const id = req.params.id;
  const updateStatus = req.body;
  const filter = { _id: ObjectId(id) };
  const options = { upsert: true };
  console.log(updateStatus.status);

  const updateDoc = {
    $set: {
      status: updateStatus.status,
    },
  };
  console.log(updateDoc);
  const result = await ordersCollection.updateOne(filter, updateDoc, options);
  console.log("show id", id);
  res.json(result);
});

app.get("/", (req, res) => {
  try {
    res.send("Restaurant Server Is Running 🚩");
  } catch (error) {
    console.log(error.name, error.message);
  }
});

app.listen(port, () => {
  console.log("hello i am running");
});
