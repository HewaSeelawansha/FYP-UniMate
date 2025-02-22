const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    name: String,
    email: {
        type: String,
        trim: true,
        minlength: 3
    },
    photoURL: String, 
    role: {
        type: String,
        enum: ['user', 'admin', 'owner'],
        default: 'user'
    },
    roommate: {
        type: String,
        enum: ['yes', 'no']
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'unisex']
    }
    },
    { timestamps: true }
);

//create model
const User = mongoose.model("User", userSchema);

module.exports = User;