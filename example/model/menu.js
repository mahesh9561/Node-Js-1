const mongoose = require('mongoose');

const menuItemSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    taste: {
        type: String,
        enum: ['sweet', 'spicy', 'sour'],
        require: true
    },
    is_drink: {
        type: Boolean,
        require: false
    },
    incredients: {
        type: [String],
        default: []
    },
    num_sales: {
        type: Number,
        default: 0,
    }
})

const userItem = mongoose.model('userItem', menuItemSchema);
module.exports = userItem;