const mongoose = require('mongoose');
require('dotenv').config();

// const user_url = "mongodb://localhost:27017";
const user_url = process.env.MONGO_URL;


mongoose.connect(user_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('connected', () => {
    console.log("Connected to mongoDB server");
})

db.on('error', () => {
    console.log("Error connecting to mongoDB server");
})
db.on('disconnected', () => {
    console.log("Disconnected from mongoDB server");
})

module.exports = db;