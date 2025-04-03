const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/user.model.js");

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "2d" });
};

// Register User
const registerUser = async (req, res) => {
    try {
        const { name, email, password, profileImageUrl, adminInviteToken } = req.body;

        // Check if user exists
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Role assignment with admin invite token validation
        let role = "member";
        if (adminInviteToken && adminInviteToken === process.env.ADMIN_INVITE_TOKEN) {
            role = "admin";
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profileImageUrl,
            role,
        });

        // Return user details and token
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error("Error while registering user:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Login User 
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;


        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" })
        };


        // compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" })
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id)
        })


    } catch (error) {
        console.error("Error while logging in:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get User Profile 
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.json(user);

    } catch (error) {
        console.error("Error while retrieving user profile:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update User Profile 
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { name, email, profileImageUrl, password } = req.body;

        if (name) user.name = name;
        if (email) user.email = email;
        if (profileImageUrl) user.profileImageUrl = profileImageUrl;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
        });
    } catch (error) {
        console.error("Error while updating user profile:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



module.exports = {
    getUserProfile,
    registerUser,
    loginUser,
    updateUserProfile,
};


const jwt = require('jsonwebtoken');
const User = require('../model/task.model.js')


const protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        console.log('Token:', token);

        if (token && token.startsWith("Bearer")) {
            token = token.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            console.log('Decoded:', decoded);

            req.user = await User.findById(decoded.id).select("-password");
            console.log('User from DB:', req.user);
            next();
        } else {
            res.status(401).json({ message: "Not authorized, no token" })
        }
    } catch (error) {
        res.status(401).json({ message: "token failed", message: error.message })

    }
}

// middleware only for admin access

const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Access denied, admin only" })

    }
}


module.exports = { adminOnly, protect }
const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controller/auth.controller');
const { protect } = require('../middleware/authMiddleware.js')

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);


module.exports = router;
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImageUrl: { type: String, default: null }, 
    role: { type: String, enum: ["admin", "member"], default: "member" }, 
}, 
{
    timestamps: true 
});


const User = mongoose.model("User", userSchema);

module.exports = User;