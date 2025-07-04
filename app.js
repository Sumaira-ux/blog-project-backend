const express = require("express");
const mongoose = require("mongoose");
const Post = require("./blogPostModel");
const cors = require("cors");
const app = express();
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => { console.log("Database connected successfully") })
    .catch((err) => { console.log("Something went wrong", err) });

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Blog Post Backend Working");
});

// CREATE blog post
app.post("/posts", async (req, res) => {
    try {
        const { title, description, author } = req.body;
        const postData = await Post.create({ title, description, author });
        res.status(200).json(postData);
    } catch (err) {
        res.status(500).json({ message: "Post not saved", error: err.message });
    }
});

// READ all blog posts
app.get("/posts", async (req, res) => {
    try {
        const allPosts = await Post.find().select("-createdAt -updatedAt -__v");
        res.status(200).json(allPosts);
    } catch (err) {
        res.status(500).json({ message: "Fetching posts failed", error: err.message });
    }
});

// READ single post
app.get("/posts/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const singlePost = await Post.findById(id).select("-createdAt -updatedAt -__v");
        if (!singlePost) return res.status(404).json({ message: "Post not found" });
        res.status(200).json(singlePost);
    } catch (err) {
        res.status(500).json({ message: "Fetching single post failed", error: err.message });
    }
});

// DELETE a single post
app.delete("/posts/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const deletedPost = await Post.findByIdAndDelete(id);
        if (!deletedPost) return res.status(404).json({ message: "Post not found" });
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Delete post failed", error: err.message });
    }
});

// UPDATE a post
app.put("/posts/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { title, description, author } = req.body;
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { title, description, author },
            { new: true }
        );
        if (!updatedPost) return res.status(404).json({ message: "Post not found" });
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(500).json({ message: "Update post failed", error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
