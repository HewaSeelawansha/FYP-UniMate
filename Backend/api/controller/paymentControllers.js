const Payment = require("../models/Payments");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Booking = require("../models/booking");
const Listing = require("../models/listing")

// post a new menu item
const postPaymentItem = async (req, res) => {
    const payment = req.body;
    const { booking, status, paid, price } = req.body;
    try {
        const paymentRequest = await Payment.create(payment);
        const updatedBooking = await Booking.findById(booking);
        if (!updatedBooking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Update the status and paid properties
        updatedBooking.paystatus = status;
        updatedBooking.paid = paid;
        updatedBooking.payment = price;

        // Save the updated booking
        await updatedBooking.save();

        // Return success response
        res.status(200).json({ paymentRequest });
    } catch (error) {
        console.error(error);  // Add logging for better debugging
        res.status(400).json({ message: error.message });
    }
};

// get all payment requests
const getPayements = async (req, res) => {
    const email = req.query.email;
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
    getPayements,
    getPaymentsByListing
}