const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// ---- middleware ----
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*', // e.g. http://localhost:5173
  credentials: true,
}));
app.use(express.json());

// ---- MongoDB ----
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mbdxuw9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
});

async function run() {
  try {
    await client.connect();
    const db = client.db("jobNestDB");
    const jobsCollection = db.collection("jobs");

    console.log("✅ MongoDB Connected & Collections Ready");

    // ---------- ROUTES ----------

    // health
    app.get('/', (_req, res) => res.send('Career Code API Running...'));

    // Get all jobs (basic filtering & search optional)
    app.get('/api/jobs', async (req, res) => {
      const { q, status } = req.query;
      const filter = {};
      if (q) filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { company: { $regex: q, $options: 'i' } }
      ];
      if (status) filter.status = status;

      const jobs = await jobsCollection.find(filter).sort({ _id: -1 }).toArray();
      res.send(jobs);
    });

    // Get job by ID
    app.get('/api/jobs/:id', async (req, res) => {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) return res.status(400).send({ error: "Invalid id" });
      const job = await jobsCollection.findOne({ _id: new ObjectId(id) });
      if (!job) return res.status(404).send({ error: "Job not found" });
      res.send(job);
    });

    // Create job
    app.post('/api/jobs', async (req, res) => {
      const { title, company, status = 'Active', ...rest } = req.body || {};
      if (!title || !company) return res.status(400).send({ error: "title and company are required" });

      const doc = { title, company, status, ...rest, createdAt: new Date() };
      const result = await jobsCollection.insertOne(doc);
      res.status(201).send({ _id: result.insertedId, ...doc });
    });

    // Update job
    app.put('/api/jobs/:id', async (req, res) => {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) return res.status(400).send({ error: "Invalid id" });

      const { title, company, status, ...rest } = req.body || {};
      const update = { ...(title && { title }), ...(company && { company }), ...(status && { status }), ...rest, updatedAt: new Date() };

      const result = await jobsCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: update },
        { returnDocument: 'after' }
      );
      if (!result.value) return res.status(404).send({ error: "Job not found" });
      res.send(result.value);
    });

    // Delete job
    app.delete('/api/jobs/:id', async (req, res) => {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) return res.status(400).send({ error: "Invalid id" });

      const result = await jobsCollection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) return res.status(404).send({ error: "Job not found" });
      res.send({ ok: true });
    });
  } catch (err) {
    console.error(err);
  }
}
run().catch(console.dir);

app.listen(port, () => console.log(`Career Code server is running on port ${port}`));
