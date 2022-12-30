const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
const cors = require("cors");
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello Insta");
});

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.tgkwl01.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  const postsCollections = client.db("engGameSocial").collection("posts");
  const commentsCollections = client.db("engGameSocial").collection("comments");
  const usersCollections = client.db("engGameSocial").collection("users");
  const likesCollections = client.db("engGameSocial").collection("likes");

  try {
    app.get("/posts", async (req, res) => {
      const result = await postsCollections.find({}).sort({_id:-1}).toArray();
      res.send(result);
    });


    app.get("/posts/:id", async (req, res) => {
      const id = req.params.id
      const query = {_id:ObjectId(id)}
      const result = await postsCollections.findOne(query)
      res.send(result);
    });



    app.post('/posts',async(req,res)=>{
      const post = req.body;
      const result = await postsCollections.insertOne(post)
      res.send(result)
    })
    

   

    app.put('/posts/:id',async(req,res)=>{
      const id = req.params.id
      const like = req.body;
      const filter = {_id: ObjectId(id)};
      const option = { upsert:true }
      const updateLike = {
        $set:{
          likes:[like],
        }
      }
      const result = await postsCollections.updateMany(filter,updateLike,option)
      res.send(result)
    })

    app.get('/details/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id:ObjectId(id  )}
      const result = await postsCollections.findOne(query);
      res.send(result)
    })

    app.get('/comments/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {id:id};
      const result = await commentsCollections.find(query).sort({_id:-1}).toArray();
      res.send(result)
    })

    app.get('/commentshome/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {id:id};
      const result = await commentsCollections.find(query).limit(3).sort({_id:-1}).toArray();
      res.send(result)
    })

    app.post('/comments',async(req,res)=>{
      const comment = req.body;
      const result = await commentsCollections.insertOne(comment)
      res.send(result)
    })

    app.get('/user',async(req,res)=>{
      const email = req.query.email;
     if(email){
       const query = {email:email}
      const result = await usersCollections.findOne(query)
      res.send(result)
     }
    })

    app.post('/user',async(req,res)=>{
      const user = req.body;
      const email = user.email;
      const query = { email: email };
      const oldUser = await usersCollections.findOne(query);
      if (email === oldUser?.email) {
        return;
      }
      const result = await usersCollections.insertOne(user);
      res.send(result);
      
    })

    app.put('/user',async(req,res)=>{
      const email = req.query.email
      console.log(email)
      const profile = req.body;
      const filter = {email:email}
      const option = { upsert:true }
      const updateUser= {
        $set:{
          'email':profile.email,
          'photoURL':profile.photoURL,
          'displayName':profile.displayName,
          'address':profile.address,
          'university':profile.university
        }
      }
      const result = await usersCollections.updateOne(filter,updateUser,option)
      res.send(result)
    })
    
    app.post('/like',async(req,res)=>{
      const like = req.body;
      const result = await likesCollections.insertOne(like)
      res.send(result)

    })

    app.put('/like/:id',async(req,res)=>{
      const id = req.params.id;
      const like = req.body;
      const filter = {id:id}
      const option = { upsert:true }
      const updateLike= {
        $set:{
          'email':like.id,
          'likeCount':like.likeCount,
          'name':like.name,
          'image':like.image,
          'email':like.email
        }
      }
      const result = await likesCollections.updateOne(filter,updateLike,option)
      res.send(result)
    })

    app.get('/like/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {id:id};
      const result = await likesCollections.findOne(query);
      res.send(result)
    })

    app.get('/like',async(req,res)=>{
      const result = await likesCollections.find({}).sort({likeCount:-1}).limit(3).toArray();
      res.send(result)
    })




    // End
  } 
  
  finally {
  }
};

run().catch((err) => {
  console.error(err);
});

app.listen(port, () => {
  console.log("port running on port:", port);
});
