const mongoose = require('mongoose');
const {Schema} = mongoose;

const paymentSchema = new Schema({
    transactionId: String,
    listing: {
        type: Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },
    booking: {
        type: Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    email: String,
    price: Number, 
    paid: String,
    status: String
    },
    { timestamps: true }
);

//create payment model
const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;