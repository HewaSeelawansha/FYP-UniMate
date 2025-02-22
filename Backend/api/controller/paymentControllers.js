const Payment = require("../models/Payments");
const Carts = require("../models/carts");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// post a new menu item
const postPaymentItem = async (req, res) => {
    const payment = req.body;
    try{
        const paymentRequest = await Payment.create(payment);
        res.status(200).json({paymentRequest});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

// get all payment requests
const getPayements = async (req, res) => {
    const email = req.query.email;
    const query = {email: email};
    try{
        const decodedEmail = req.decoded.email;
        if(decodedEmail !== email){
            return res.status(403).json({message: "Forbidden access!"})
        }
        const result = await Payment.find(query).sort({createdAt: -1}).exec();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports = {
    postPaymentItem,
    getPayements
}