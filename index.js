const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
// const admin = require("firebase-admin");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ebhzh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('photography');
        const galleryCollection = database.collection('gallery');
        const photoCollection = database.collection('photos');
        const cinemaCollection = database.collection('cinemas');
        const addonCollection = database.collection('addons');

         app.get('/gallery', async(req,res)=>{
            const cursor = galleryCollection.find({});
            const gallery = await cursor.toArray();
            res.send(gallery);
        });
        app.get('/photos', async(req,res)=>{
            const cursor = photoCollection.find({});
            const photos = await cursor.toArray();
            res.send(photos);
        });
        app.get('/cinemas', async(req,res)=>{
            const cursor = cinemaCollection.find({});
            const cinemas = await cursor.toArray();
            res.send(cinemas);
        });
        app.get('/addons', async(req,res)=>{
            const cursor = addonCollection.find({});
            const addon = await cursor.toArray();
            res.send(addon);
        });

    }
    finally{
        //await client.close();
    }

}
run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('top takes website running');
});

app.listen(port, ()=>{
    console.log('hey i am running')
});
