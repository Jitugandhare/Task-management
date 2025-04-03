const jwt = require('jsonwebtoken');
const User = require('../model/user.model.js')


const protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        // console.log('Token:', token);

        if (token && token.startsWith("Bearer")) {
            token = token.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // console.log('Decoded:', decoded);

            req.user = await User.findById(decoded.id).select("-password");
            // console.log('User from DB:', req.user);
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