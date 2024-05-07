const express = require('express');
const route = express.Router();
const Person = require('./../model/person');

// post method for person
route.post('/', async (req, res) => {
    try {
        console.log(req.body);
        const data = req.body;
        // create new person document using mongoose schema
        const newPerson = new Person(data);
        // save the new person to the database
        const response = await newPerson.save();
        console.log("data saved");
        res.status(200).json(response);
    } catch (error) {
        console.log("Error saving person : ", error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// get method for person
route.get('/', async (req, res) => {
    try {
        const data = await Person.find();
        console.log("data fetched");
        res.status(200).json(data);
    } catch (error) {
        console.log("Error fetching person : ", error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// get method for specific work in person
route.get('/:work', async (req, res) => {
    try {
        const work = req.params.work;
        if (work === "chef" || work === "waiter" || work === "manager" || work === "other") {
            const response = await Person.find({ work: work });
            console.log("response fetched");
            res.status(200).json(response);
        } else {
            res.status(400).json({ error: 'Invalid work type' });
        }
    } catch (error) {
        console.log("Error fetching person : ", error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

route.put('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const updatedPersonData = req.body;
        const response = await Person.findByIdAndUpdate(userId, updatedPersonData,
            {
                new: true,
                runValidators: true
            }
        );
        if (!response) {
            return res.status(404).json({ error: "Person not found" })
        }
        console.log("data fetch");
        res.status(200).json(response);
    } catch (error) {
        console.log("Error fetching person : ", error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
})

route.delete('/:id', async (res, req) => {
    try {
        const userId = res.params.id;
        const response = await Person.findByIdAndDelete(userId);
        if (!response) {
            return res.status(404).json({ error: "Person not found" });
        }
        console.log("Data sucessfully delete");
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: 'Internal server error'
        });
    }
})

module.exports = route;
