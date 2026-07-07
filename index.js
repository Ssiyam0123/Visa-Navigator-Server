const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;


app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const database = client.db("visaDb").collection("visas");
    const applicationsbase = client.db("visaDb").collection("applications");

    app.post("/visas", async (req, res) => {
      const visa = req.body;
      const result = await database.insertOne(visa);
      res.send(result);
    });

    app.get("/visas", async (req, res) => {
      const cursor = database.find();
      const result = await cursor.limit(6).toArray();
      res.json(result);
    });

    app.get("/allVisas", async (req, res) => {
      const cursor = database.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/visas/:id", async (req, res) => {
      const id = req.params.id;
      const visa = await database.findOne({ _id: new ObjectId(id) });
      res.send(visa);
    });

    app.put("/visas/:id", async (req, res) => {
      const id = req.params.id;
      const visa = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateResult = {
        $set: {
          countryName: visa.countryName,
          visaType: visa.visaType,
          processingTime: visa.processingTime,
          fee: visa.fee,
          validity: visa.validity,
          applicationMethod: visa.applicationMethod,
        },
      };

      try {
        const result = await database.updateOne(filter, updateResult);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Error updating visa", error });
      }
    });

    app.delete("/visas/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await database.deleteOne(query);
      res.send(result);
    });

    app.get("/results/:email", async (req, res) => {
      const email = req.params.email;
      const visas = await database.find({ email }).toArray();
      res.send(visas);
    });

    app.post("/applications", async (req, res) => {
      const data = req.body;
      const result = await applicationsbase.insertOne(data);
      res.send(result);
    });

    app.get("/applications", async (req, res) => {
      const { searchParams } = req.query;
      let option = {}; 
    
      if (searchParams) {
        option = { "visa.countryName": { $regex: searchParams, $options: "i" } };
      }
    
      try {
        const cursor = applicationsbase.find(option);
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).send({ error: "Failed to fetch applications." });
      }
    });
    

    app.get("/applications/:email", async (req, res) => {
      const email = req.params.email;
      const result = await applicationsbase.find({ email }).toArray();
      res.send(result);
    });

    app.delete("/applications/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await applicationsbase.deleteOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
