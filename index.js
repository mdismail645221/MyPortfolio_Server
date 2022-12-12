const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();


// middleware
app.use(express.json());
app.use(cors());


app.get('/', (req, res)=> {
    res.send("MY PORTFOLIO RUNNING")
})


// MyPortFolio
// C2xZWZxzes1MWaE1

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://MyPortFolio:C2xZWZxzes1MWaE1@cluster0.cn0mdvb.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run () {
    try{
        const projectsCollection = client.db("MyPortFolio").collection("myProjects");


        app.get('/projects', async(req, res)=> {
            const query = {};
            const result = await projectsCollection.find(query).toArray();
            res.send(result)
        })

        // signle project
        app.get('/projects/:id', async(req, res)=> {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await projectsCollection.findOne(query);
            res.send(result)

        })



    }
    catch{(e)=> {
        console.dir(e)
    }}
}

run().catch((e)=> {
    console.log(e)
})






app.listen(port, ()=> {
    console.log("my portfolio is running", port)
})