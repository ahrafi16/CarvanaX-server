const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rinnvkt.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let carCollection;

// Connect to MongoDB once
async function connectDB() {
    if (!carCollection) {
        await client.connect();
        carCollection = client.db('carvanaXDB').collection('cars');
    }
}

// get car data
app.get('/cars', async (req, res) => {
    await connectDB();
    const result = await carCollection.find().toArray();
    res.send(result);
});

// get a single car data
app.get('/cars/:id', async (req, res) => {
    await connectDB();
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await carCollection.findOne(query);
    res.send(result);
});

// post car data
app.post('/cars', async (req, res) => {
    await connectDB();
    const newCar = req.body;
    const result = await carCollection.insertOne(newCar);
    res.send(result);
});

// update a car
app.put('/cars/:id', async (req, res) => {
    await connectDB();
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const options = { upsert: true };
    const updatedCar = req.body;
    const car = {
        $set: updatedCar
    };
    const result = await carCollection.updateOne(filter, car, options);
    res.send(result);
});

// delete a car
app.delete('/cars/:id', async (req, res) => {
    await connectDB();
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await carCollection.deleteOne(query);
    res.send(result);
});

app.get('/', (req, res) => {
    res.send('CarvanaX Server is running');
});

// Export for Vercel
module.exports = app;