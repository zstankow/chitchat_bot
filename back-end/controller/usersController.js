const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../schemas/schemas');
require('dotenv').config();
const saltRounds = 5;
const KEY = process.env.KEY;

async function signup(req, res) {
    const { email, password, firstName, lastName, level } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await User.create({ email, password: hashedPassword, firstName, lastName, level });
        res.send('User registered successfully');
    } catch (error) {
        console.error(error);
        if (error.code === 11000)
            res.status(409).send('Email already exist');
        else
            res.status(500).send('Error registering new user');
    }
}

async function login(req, res) {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user._id }, KEY);
            res.send({ token, id: user._id, firstName: user.firstName, lastName: user.lastName, level: user.level});
        } else
            res.status(401).send('Invalid email or password');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error during login');
    }
}

async function update(req, res) {
    const userId = req.params.id;
    const { email, password, firstName, lastName, level } = req.body;
    try {
        const updatedFields = {
            email: email || '',
            firstName: firstName || '',
            lastName: lastName || '',
            level: level || '',
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            updatedFields.password = hashedPassword;
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, { new: true });

        if (!updatedUser)
            return res.status(404).send('User not found');

        res.send('Updated!');
    } catch (error) {
        console.error(error);
        if (error.code === 11000)
            res.status(409).send('Email already exist');
        else
            res.status(500).send('Update error');
    }
}

async function getUserInfos(req, res) {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user)
            return res.status(404).send('User not found');

        res.json(user);
    } catch (error) {
        res.status(500).send('Server error');
    }
}

module.exports = { signup, login, update, getUserInfos };