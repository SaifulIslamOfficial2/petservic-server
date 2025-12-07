import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';

import express from 'express';
import cors from "cors"
import dotenv from "dotenv";
const app = express()
const PORT = process.env.PORT || 3000;
dotenv.config();


// midlware
app.use(cors());
app.use(express.json());


// main route
app.get('/',(req,res)=>{
    res.send("hello developer")
})


const uri = "mongodb+srv://pawmart:M6tXKXpP1Ar37nTP@cluster0.ebf9ofi.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
 
    await client.connect();
    const pawmartdb = client.db('pawmartdb')
    const addPetCollection = pawmartdb.collection('addproducts')

    app.post('/addproducts',async(req,res)=>{
      const data = req.body;
      console.log(data)
      const result = await addPetCollection.insertOne(data);
      res.send(result)
    })

    // app.get('/addproducts',async (req,res)=>{
    //   const data = req.body;
    //   const result = await addPetCollection.find().toArray();
    //   res.send(result)
    // })
  
    

  app.get('/addproducts/:id', async (req, res) => {
  const id = req.params.id;
  console.log(id)
  const query = { _id: new ObjectId(id) };
  const result = await addPetCollection.findOne(query);
  res.send(result);
  });

  app.get('/my-services', async (req, res) => {
  const email = req.query.email; // <-- fix
  const query = { email: email };
  const result = await addPetCollection.find(query).toArray();
  res.send(result);
  });

  //  edit dat 
app.put('/updatepage/:id', async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const query = { _id: new ObjectId(id) };
  const updateData = {
    $set: data
  };
  const result = await addPetCollection.updateOne(query, updateData);
  res.send(result);
});

app.delete('/delete/:id',async(req,res)=>{
  const id = req.params
  const query = {_id: new ObjectId(id)}
  const result = await addPetCollection.deleteOne(query)
  res.send(result)
})

app.get('/addproducts', async (req, res) => {
  const { category } = req.query;
  console.log(category);

  const query = {};

  if (category && category !== "All") {
    query.category = category;
  }

  const result = await addPetCollection.find(query).toArray();
  res.send(result);
});

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
 
  }
}





run().catch(console.dir);


app.listen(PORT, ()=>{
    console.log(`server is running ${PORT}`)
})



// M6tXKXpP1Ar37nTP
// pawmart