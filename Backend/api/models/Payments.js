const mongoose = require('mongoose');
const {Schema} = mongoose;

//schema menu
const paymentSchema = new Schema({
    transactionId: String,
    email: String,
    price: Number, 
    quantity: Number,
    status: String,
    itemName: String,
    cartItems: String,
    menuItems: String,
    },
    { timestamps: true }
);

//create model
const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;