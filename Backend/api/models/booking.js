const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookingSchema = new Schema({
    listing: {
        type: Schema.Types.ObjectId,
        ref: 'Listing',
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
        type: String
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
    payment: {
        type: Number,
        default: 0
    },
},  {
    timestamps: true,
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;