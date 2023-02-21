const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion,  ObjectId } = require('mongodb');
const {query} = require("express");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ui8slz3.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const addCollection = client.db("todoApp").collection("addTask");

        // add task
        app.post('/addTask', async(req,res)=>{
            const addTask = req.body;
            console.log(req.body);
            const result = await addCollection.insertOne(addTask);
            res.send(result)
        })

        // get alll task
        app.get('/addTask', async (req,res)=>{
            const query = {};
            const cursor = addCollection.find(query);
            const task = await cursor.toArray();
            const result = task.reverse();
            res.send(result);
            console.log(result);
        })

        // delete task
		app.delete("/addTask/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const result = await addCollection.deleteOne(query);
			res.send(result);
		});

        //get specific task to update
        app.get('/edit/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id)
            };
            const result = await addCollection.findOne(query);
            res.send(result);
        })

        // update task  :
		app.put("/edit/:id", async (req, res) => {
			const id = req.params.id;
			console.log(id);
			console.log(req.body);
			const editTitle = req.body.updatedTitle;
            const editMessage = req.body.updatedMessage
			const query = { _id: new ObjectId(id)};
			const option = {upsert : true}
			const updatedDoc = {
				$set: {
                    title: editTitle,
					message: editMessage
				},
			};
			const result = await addCollection.updateOne(query, updatedDoc,option);
			res.send(result);
		});


        //update field for advertise
        app.put('/addTask/:id', async (req, res) => {
            const id = req.params.id;
            const filter = {
                _id: new ObjectId(id)
            }
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    complete: false
                }
            }
            const result = await addCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })
    }
    finally{

    }
}
run().catch((err) =>console.log(err));

app.get('/', (req,res) =>{
    res.send('add task is running')
})

app.listen(port,()=>{
    console.log(`add task server is running on ${port}`);
})