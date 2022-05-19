const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion ,ObjectId} = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri =process.env.DB

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    console.log('DB Connected successfully');
    const todoCollection = client.db('Todo').collection('todo');
    app.get('/todo', async (req, res) => {
      const query = {};
      const cursor = todoCollection.find(query);
      const todo = await cursor.toArray();
      res.send(todo);
    });
    app.post('/todo', async (req, res) => {
      const item = req.body;
      console.log(item);
      const result = await todoCollection.insertOne(item);
      console.log(result);
      res.send(result);
    });

      app.delete('/todo/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const todo = await todoCollection.deleteOne(query);
      console.log(todo);
      res.send(todo);
    });
  } finally {
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(` App listening on port ${port}`);
});
