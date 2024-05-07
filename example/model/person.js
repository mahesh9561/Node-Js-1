const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    age: {
        type: Number,
        require: true
    },
    work: {
        type: String,
        enum: ['chef', 'waiter', 'manager', 'other'],
        require: true,
    },
    mobile: {
        type: Number,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    address: {
        type: String,
        require: true,
    },
    salery: {
        type: Number,
        require: true,
    },
    username: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    }
})

// create person model
const Person = mongoose.model('Person', personSchema);
module.exports = Person;