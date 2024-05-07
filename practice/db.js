const mongoose = require('mongoose');
const DB_URL = "mongodb+srv://mahesh:vivek@cluster0.ezqezdh.mongodb.net/testApp"
mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
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