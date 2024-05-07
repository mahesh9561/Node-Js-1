const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true,
    },
    email: {
        type: String,
        required:true,
        unique: true
    },
    uid: {
        type: String,
        required:true,
        unique: true
    },
    psw: {
        type: String,
        required:true,
    },
}
)

module.exports = mongoose.model("user",userSchema)