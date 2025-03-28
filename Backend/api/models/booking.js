const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookingSchema = new Schema({
    listing: {
        type: Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },
    owner: {
        type: String, 
        required: true
    },
    email: {
        type: String, 
        required: true
    },
    movein: {
        type: String, 
        required: true
    },
    payvia: {
        type: String,
        required: true
    },
    needs: {
        type: String,
        default: 'Not Specified'
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    paystatus: {
        type: String,
        enum: ['Done', 'Not Yet'],
        default: 'Not Yet'
    },
    paid: {
        type: String,
        enum: ['Key Money & Rental', 'Key Money', 'Rental', 'Nothing'],
        default: 'Nothing'
    },
    payment: {
        type: Number,
        default: 0
    },
},  {
    timestamps: true,
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;