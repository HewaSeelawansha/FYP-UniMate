const Payment = require("../models/Payments");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Booking = require("../models/booking");
const Listing = require("../models/listing")

// get all payments
const getAllPayments = async (req, res) => {
    try{
        const payments = await Payment.find({})
        .sort({createdAt: -1})
        .populate('booking') 
        .populate('listing') 
        .exec();
        
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

// post a new payment
const postPaymentItem = async (req, res) => {
    const payment = req.body;
    const { booking, status, paid, price } = req.body;
    try {
        const paymentRequest = await Payment.create(payment);
        const updatedBooking = await Booking.findById(booking);
        if (!updatedBooking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        updatedBooking.paystatus = status;
        updatedBooking.paid = paid;
        updatedBooking.payment = price;

        await updatedBooking.save();

        res.status(200).json({ paymentRequest });
    } catch (error) {
        console.error(error);  
        res.status(400).json({ message: error.message });
    }
};

// get all payment requests
const getPayementsStudent = async (req, res) => {
    const email = req.params.email;
    const query = {email: email};
    try{
        const decodedEmail = req.decoded.email;
        if(decodedEmail !== email){
            return res.status(403).json({message: "Forbidden access!"})
        }
        const result = await Payment.find(query)
            .sort({createdAt: -1})
            .populate('booking') 
            .populate('listing') 
            .exec();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const getPaymentsByListing = async (req, res) => {
    const email = req.params.email;
    try {
        const listings = await Listing.find({ owner: email }).exec();
        if (!listings || listings.length === 0) {
            return res.status(404).json({ message: 'No listings found for this email' });
        }
        const listingIds = listings.map(listing => listing._id);
        const payments = await Payment.find({ listing: { $in: listingIds } })
            .sort({ createdAt: -1 })
            .populate('booking') 
            .populate('listing')
            .exec();
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    postPaymentItem,
    getPayementsStudent,
    getPaymentsByListing,
    getAllPayments
}