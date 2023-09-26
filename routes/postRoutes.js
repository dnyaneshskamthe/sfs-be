const Post = require('../models/postModel');
const express = require('express');
const router = express.Router();
const upload = require('../multer');
const cloudinary = require('../cloudnary');
const checkAuth = require('../middleware/checkAuth');


router.post("",checkAuth, upload.single('image'), async (req, res, next) => {
    try {
        // Check if req.file is available
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);

        // Process other form data (title, content, etc.)
        const { title, content } = req.body;
        const author = req.user.id;

        // Create a new post using the PostModel
        const newPost = new Post({
            title,
            content,
            image: result.secure_url, // Store the Cloudinary URL
            author : author
        });

        // Save the new post to the database
        await newPost.save();

        // Respond with success message
        res.status(201).json({
            message: "Post added successfully",
            post: newPost
        });
    } catch (error) {
        console.error('Error creating blog post:', error);
        res.status(500).json({ message: 'An error occurred' });
    }
});


module.exports = router;