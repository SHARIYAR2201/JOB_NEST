// index.js (server)
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// ---------- Uploads setup ----------
const uploadsDir = path.join(process.cwd(), 'uploads');
const resumesDir = path.join(uploadsDir, 'resumes');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
if (!fs.existsSync(resumesDir)) fs.mkdirSync(resumesDir);
app.use('/uploads', express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, resumesDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.pdf';
    const safeId = (req.params.id || 'unknown').toString();
    cb(null, `${safeId}-${Date.now()}${ext}`);
  }
});
const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed'));
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// ---------- Middleware ----------
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
}));
app.use(express.json());

// ---------- Mongo ----------
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mbdxuw9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
});

// ---------- Password helpers (scrypt) ----------
function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      resolve({ salt, hash: derivedKey.toString('hex') });
    });
  });
}

// remove a local file if it exists
function tryDeleteLocalFile(publicUrl) {
  try {
    // we only delete files served from our /uploads path
    // e.g. http://localhost:3000/uploads/resumes/<file>
    const uploadsPrefix = '/uploads/';
    const idx = publicUrl.indexOf(uploadsPrefix);
    if (idx === -1) return;

    const relPath = publicUrl.substring(idx + 1); // remove leading slash
    const absolute = path.join(process.cwd(), relPath);
    if (fs.existsSync(absolute)) {
      fs.unlinkSync(absolute);
      console.log('Deleted old resume file:', absolute);
    }
  } catch (e) {
    console.warn('Failed to delete old resume file:', e.message);
  }
}

async function run() {
  await client.connect();
  const db = client.db('jobNestDB');

  const jobsCollection = db.collection('jobs');
  const usersCollection = db.collection('users');

  await usersCollection.createIndex({ email: 1 }, { unique: true });

  console.log('✅ MongoDB Connected & Collections Ready');

  // ---------- Health ----------
  app.get('/', (_req, res) => res.send('Career Code API Running...'));

  // ---------- USERS ----------

  // Register
  app.post('/api/register', async (req, res) => {
    try {
      const { email, password, fullName, mobileNumber, role } = req.body || {};
      if (!email || !password || !fullName || !mobileNumber || !role) {
        return res.status(400).send({ error: 'email, password, fullName, mobileNumber, role are required' });
      }
      const allowedRoles = ['jobseeker', 'company', 'admin'];
      if (!allowedRoles.includes(role)) {
        return res.status(400).send({ error: 'role must be one of jobseeker, company, admin' });
      }
      if (password.length < 6) {
        return res.status(400).send({ error: 'Password must be at least 6 characters' });
      }

      const emailLc = String(email).toLowerCase();
      const exists = await usersCollection.findOne({ email: emailLc });
      if (exists) return res.status(409).send({ error: 'Email already registered' });

      const { salt, hash } = await hashPassword(password);
      const doc = {
        email: emailLc,
        passwordHash: hash,
        passwordSalt: salt,
        fullName,
        mobileNumber,
        role,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = await usersCollection.insertOne(doc);

      res.status(201).send({
        _id: result.insertedId,
        email: doc.email,
        fullName: doc.fullName,
        mobileNumber: doc.mobileNumber,
        role: doc.role,
        isActive: doc.isActive,
        createdAt: doc.createdAt,
      });
    } catch (err) {
      if (err?.code === 11000) return res.status(409).send({ error: 'Email already registered' });
      console.error('POST /api/register error:', err);
      res.status(500).send({ error: 'Internal server error' });
    }
  });

  // List users
  app.get('/api/users', async (req, res) => {
    try {
      const { role, page = 1, limit = 20 } = req.query;
      const filter = {};
      if (role) {
        const allowedRoles = ['jobseeker', 'company', 'admin'];
        if (!allowedRoles.includes(role)) {
          return res.status(400).send({ error: 'Invalid role filter' });
        }
        filter.role = role;
      }

      const pageNum = Math.max(parseInt(page, 10) || 1, 1);
      const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);

      const cursor = usersCollection
        .find(filter)
        .project({ passwordHash: 0, passwordSalt: 0 })
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum);

      const [items, total] = await Promise.all([
        cursor.toArray(),
        usersCollection.countDocuments(filter),
      ]);

      res.send({ total, page: pageNum, limit: limitNum, items });
    } catch (err) {
      console.error('GET /api/users error:', err);
      res.status(500).send({ error: 'Internal server error' });
    }
  });

  // Specific-first: role lookup
  app.get('/api/users/role', async (req, res) => {
    try {
      const { email } = req.query;
      if (!email) return res.status(400).send({ error: 'email is required' });
      const user = await usersCollection.findOne(
        { email: String(email).toLowerCase() },
        { projection: { role: 1 } }
      );
      if (!user) return res.status(404).send({ error: 'User not found' });
      res.send({ role: user.role });
    } catch (err) {
      console.error('GET /api/users/role error:', err);
      res.status(500).send({ error: 'Internal server error' });
    }
  });

  // Get by email
  app.get('/api/users/by-email', async (req, res) => {
    try {
      const { email } = req.query;
      if (!email) return res.status(400).send({ error: 'email is required' });
      const doc = await usersCollection.findOne(
        { email: String(email).toLowerCase() },
        { projection: { passwordHash: 0, passwordSalt: 0 } }
      );
      if (!doc) return res.status(404).send({ error: 'User not found' });
      res.send(doc);
    } catch (e) {
      console.error(e);
      res.status(500).send({ error: 'Internal server error' });
    }
  });

  // Get by id
  app.get('/api/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) return res.status(400).send({ error: 'Invalid id' });
      const doc = await usersCollection.findOne(
        { _id: new ObjectId(id) },
        { projection: { passwordHash: 0, passwordSalt: 0 } }
      );
      if (!doc) return res.status(404).send({ error: 'User not found' });
      res.send(doc);
    } catch (e) {
      console.error('GET /api/users/:id error:', e);
      res.status(500).send({ error: 'Internal server error' });
    }
  });

  // Update profile
  app.put('/api/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) return res.status(400).send({ error: 'Invalid id' });

      const {
        fullName, mobileNumber, address, avatarUrl,
        resumeUrl, resumeFileUrl,
        headline, skills,
        companyName, website, foundedYear, companySize, description
      } = req.body || {};

      const update = {
        ...(fullName !== undefined && { fullName }),
        ...(mobileNumber !== undefined && { mobileNumber }),
        ...(address !== undefined && { address }),
        ...(avatarUrl !== undefined && { avatarUrl }),
        ...(resumeUrl !== undefined && { resumeUrl }),
        ...(resumeFileUrl !== undefined && { resumeFileUrl }),
        ...(headline !== undefined && { headline }),
        ...(skills !== undefined && { skills }),
        ...(companyName !== undefined && { companyName }),
        ...(website !== undefined && { website }),
        ...(foundedYear !== undefined && { foundedYear }),
        ...(companySize !== undefined && { companySize }),
        ...(description !== undefined && { description }),
        updatedAt: new Date()
      };

      const result = await usersCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: update },
        { returnDocument: 'after', projection: { passwordHash: 0, passwordSalt: 0 } }
      );

      if (!result.value) return res.status(404).send({ error: 'User not found' });
      res.send(result.value);
    } catch (e) {
      console.error(e);
      res.status(500).send({ error: 'Internal server error' });
    }
  });

  // Upload resume (PDF)
  app.post('/api/users/:id/resume', upload.single('resume'), async (req, res) => {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) return res.status(400).send({ error: 'Invalid id' });
      if (!req.file) return res.status(400).send({ error: 'No file uploaded' });

      const publicUrl = `${req.protocol}://${req.get('host')}/uploads/resumes/${req.file.filename}`;

      const result = await usersCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { resumeFileUrl: publicUrl, updatedAt: new Date() } },
        { returnDocument: 'after', projection: { passwordHash: 0, passwordSalt: 0 } }
      );

      if (!result.value) return res.status(404).send({ error: 'User not found' });

      res.status(201).send({
        message: 'Resume uploaded',
        resumeFileUrl: publicUrl,
        user: result.value
      });
    } catch (e) {
      console.error(e);
      res.status(500).send({ error: e.message || 'Internal server error' });
    }
  });

  // Download (redirect) resume
  app.get('/api/users/:id/resume', async (req, res) => {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) return res.status(400).send({ error: 'Invalid id' });
      const user = await usersCollection.findOne(
        { _id: new ObjectId(id) },
        { projection: { resumeFileUrl: 1 } }
      );
      if (!user?.resumeFileUrl) return res.status(404).send({ error: 'No resume uploaded' });
      res.redirect(user.resumeFileUrl);
    } catch (e) {
      console.error(e);
      res.status(500).send({ error: 'Internal server error' });
    }
  });

  // NEW: Save/replace generated resume (JSON stored in DB)
  app.put('/api/users/:id/resume-generated', async (req, res) => {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) return res.status(400).send({ error: 'Invalid id' });

      const { generatedResume, replaceExisting } = req.body || {};
      if (!generatedResume) return res.status(400).send({ error: 'No resume provided' });

      const user = await usersCollection.findOne({ _id: new ObjectId(id) });
      if (!user) return res.status(404).send({ error: 'User not found' });

      const update = { generatedResume, updatedAt: new Date() };

      if (replaceExisting) {
        // delete old uploaded pdf if exists
        if (user.resumeFileUrl) {
          tryDeleteLocalFile(user.resumeFileUrl);
        }
        update.resumeFileUrl = null;
        update.resumeUrl = null;
      }

      const result = await usersCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: update },
        { returnDocument: 'after', projection: { passwordHash: 0, passwordSalt: 0 } }
      );

      res.send({ message: 'Resume saved', user: result.value });
    } catch (e) {
      console.error('PUT /api/users/:id/resume-generated error:', e);
      res.status(500).send({ error: 'Internal server error' });
    }
  });

  // ---------- JOBS ----------
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

  app.get('/api/jobs/:id', async (req, res) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).send({ error: 'Invalid id' });
    const job = await jobsCollection.findOne({ _id: new ObjectId(id) });
    if (!job) return res.status(404).send({ error: 'Job not found' });
    res.send(job);
  });

  app.post('/api/jobs', async (req, res) => {
    const { title, company, status = 'Active', ...rest } = req.body || {};
    if (!title || !company) return res.status(400).send({ error: 'title and company are required' });

    const doc = { title, company, status, ...rest, createdAt: new Date() };
    const result = await jobsCollection.insertOne(doc);
    res.status(201).send({ _id: result.insertedId, ...doc });
  });

  app.put('/api/jobs/:id', async (req, res) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).send({ error: 'Invalid id' });

    const { title, company, status, ...rest } = req.body || {};
    const update = {
      ...(title && { title }),
      ...(company && { company }),
      ...(status && { status }),
      ...rest,
      updatedAt: new Date()
    };

    const result = await jobsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: 'after' }
    );
    if (!result.value) return res.status(404).send({ error: 'Job not found' });
    res.send(result.value);
  });

  app.delete('/api/jobs/:id', async (req, res) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).send({ error: 'Invalid id' });
    const result = await jobsCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).send({ error: 'Job not found' });
    res.send({ ok: true });
  });
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

app.listen(port, () => console.log(`Career Code server is running on port ${port}`));
