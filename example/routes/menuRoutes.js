const express = require('express');
const route = express.Router();
const userItem = require('./../model/menu')

route.post('/', async (req, res) => {
    try {
        console.log(req.body);
        const data = req.body;
        const newUserItem = new userItem(data);
        const response = await newUserItem.save();
        console.log("data saved");
        res.status(200).json(response);
    } catch (error) {
        console.log("Error saving person : ", error);
        res.status(500).json({
            error: 'Internal server error'
        })
    }
})

// get method for menu
route.get('/', async (req, res) => {
    try {
        const data = await userItem.find();
        console.log("data fetched")
        res.status(200).json(data);
    } catch (error) {
        console.log("Error saving menu:", error)

    }
})


module.exports = route;