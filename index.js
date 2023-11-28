const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//middlewares
app.use(cors());
app.use(express.json());

//mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d9lmwal.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection

    const partnersCollection = client.db("LS_DB").collection("partners");

    //partners
    app.get("/partners", async (req, res) => {
      const result = await partnersCollection.find().toArray();
      res.send(result);
    });

    //teachers
    const teacherCollection = client.db("LS_DB").collection("teachers");
    app.post("/teachers", async (req, res) => {
      const teacherReview = req.body;
      const result = await teacherCollection.insertOne(teacherReview);
      res.send(result);
    });

    app.get("/teachers", async (req, res) => {
      const result = await teacherCollection
        .find()
        .sort({ totalEnrollment: 1 })
        .toArray();
      res.send(result);
    });

    //feedback
    const feedbackCollection = client.db("LS_DB").collection("feedback");
    app.get("/feedback", async (req, res) => {
      const result = await feedbackCollection.find().toArray();
      res.send(result);
    });

    //accepted classes
    const classCollection = client.db("LS_DB").collection("classes");
    app.post("/class", async (req, res) => {
      const courses = req.body;
      const result = await classCollection.insertOne(courses);
      res.send(result);
    });

    app.get("/class", async (req, res) => {
      const result = await classCollection.find().toArray();
      res.send(result);
    });

    //single class
    app.get("/class/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await classCollection.findOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is running");
});
app.listen(port, () => {
  console.log(`port is running at ${port}`);
});
