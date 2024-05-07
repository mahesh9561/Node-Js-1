const mongoose = require('mongoose');
const todoSchema = new mongoose.Schema({
    todo: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('todo', todoSchema)