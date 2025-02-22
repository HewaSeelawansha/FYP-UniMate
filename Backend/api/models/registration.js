const mongoose = require('mongoose');
const {Schema} = mongoose;

const registrationSchema = new Schema({
    uid: String,
    email: {
        type: String,
        trim: true,
        minlength: 3,
        required: true
    },
    regNo: {
        type:String,
        required: true,
    },
    },
    { timestamps: true }
);

const Registration = mongoose.model("Registration", registrationSchema);
module.exports = Registration;