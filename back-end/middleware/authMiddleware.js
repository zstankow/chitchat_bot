require('dotenv').config();
const jwt = require('jsonwebtoken');
const KEY = process.env.KEY;

const validateData = (req, res, next) => {
    const { email, password, confirmPassword, firstName, lastName, level } = req.body;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!email || !password || !confirmPassword || !firstName || !lastName || !level)
        return res.status(400).send('All fields are required');

    if (!emailRegex.test(email))
        return res.status(400).send('Invalid email format');

    if (password !== confirmPassword)
        return res.status(400).send("Passwords don't match");

    next();
}

const validateJWT = (req, res, next) => {
    const token = req.headers.authorization.replace('Bearer ', '');
    if (!token){
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, KEY);
        req.user = decoded;
        next();
    } catch (err) {
        console.error(err.message);
        res.status(400).send('Invalid token.');
    }
}

module.exports = { validateData, validateJWT }