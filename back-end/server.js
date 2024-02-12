const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
const app = express();
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const URI = process.env.URI;
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use('/', userRoutes);

async function init() {
    const connection = await mongoose.connect(URI, { dbName: 'babel' })
    if (connection) {
        console.log('Connected to DB')
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        })
    }
}

init()