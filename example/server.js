const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();
const passport = require('passport');
const personRoutes = require('./routes/personRoutes');
const menuRoutes = require('./routes/menuRoutes');


const PORT = process.env.PORT || 3000;
// middleware
app.use(bodyParser.json());

const logRequest = (req, res, next) => {
    console.log(`[${new Date().toLocaleDateString()}] Request made to : ${req.originalUrl}`);
    next();
}

app.use(passport.initialize())
app.use(logRequest)
app.get('/', (req, res) => {
    res.send('Hello World Mahesh!');
});

// Use the routes
app.use('/person', personRoutes);
app.use('/userItem', menuRoutes);

app.listen(PORT, () => {
    console.log(`Server Run ${PORT}`);
});
