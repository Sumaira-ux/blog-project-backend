const express = require("express");
const mongoose = require("mongoose");
const Post = require("./blogPostModel");
const cors=require("cors");
const app = express();
require('dotenv').config()

mongoose.connect(process.env.MONGO_URI,  { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log("database connected successfully") })
    .catch((err) => { console.log("something went wrong", err) })

app.use(cors());
app.use(express.json());

//CREAT blog post
app.post("/posts", async (req, res) => {
    try {
        const { title, description, author } = req.body;
        const postData = await Post.create({ title, description, author })
        res.status(200).json(postData)
    } catch (err) {
        res.status(500).json({message:"Post not saved",error:err.message})
    }
})

//READ blog post all
app.get("/posts",async (req,res)=>{
    try {
        const allPosts=await Post.find().select("-createdAt -updatedAt -__v");
        res.status(201).json(allPosts)
    } catch (err) {
        res.status(500).json({message:"fetching posts failed",error:err.message})
    }
})

// Read single posts
app.get("/posts/:id",async (req,res)=>{
    try {
        const id= req.params.id;
        const singlePost=await Post.findById(id).select("-createdAt -updatedAt -__v");
        res.status(201).json(singlePost)
    } catch (err) {
        res.status(500).json({message:"fetching single post failed",error:err.message})
    }
})

//Delete a singlle posts
app.delete("/posts/:id",async (req,res)=>{
    try {
        const id= req.params.id;
        const deletedPost=await Post.findByIdAndDelete(id)
       if(!deletedPost) return res.status(404).json({message:"Post not found"})
        res.status(201).json({ message: "post deleted successfully "})
    } catch (err) {
         res.status(500).json({message:"delete post failed",error:err.message})
    }
})

//UPDATE post
app.put("/posts/:id", async (req, res)=>{
    try{
        const id=req.params.id;
        console.log(id,"id")
        console.log(req.body,"body")
        const {title, description, author}=req.body;
          const updatedPost = await Post.findByIdAndUpdate(
            id,
            { title, description, author },
            { new: true }
           )
           res.status(201).json(updatedPost);
         } catch (err) {
               res.status(500).json({ message:"update post failed", error: err.message})
        }
})


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://locahost:${PORT}`);
})


