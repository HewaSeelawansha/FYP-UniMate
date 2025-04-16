const mongoose = require('mongoose');
const {Schema} = mongoose;

const boardingSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    lng: {
        type: Number,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    distance: {
        type: Number,
        required: true,
        default: 10
    },
    phone: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: {
        type: [String]
    }, 
    amenities: {
        type: [String]
    }, 
    beds: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    }, { 
        timestamps: true 
    }
);

const Boarding = mongoose.model("Boarding", boardingSchema);
module.exports = Boarding;
