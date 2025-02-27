const Booking = require("../models/booking");

// get bookings by listing id
const getBookigsByEmail = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: 'Listing ID is required' });
        }
        const query = { listing: id };
        const result = await Booking.find(query).exec();
        res.status(200).json(result); 
    } catch (error) {
        console.error('Error fetching listings:', error.message);
        res.status(500).json({ message: error.message });
    }
};

// post a new booking
const postBooking = async (req, res) => {
    const newItem = req.body;
    try{
        const result = await Booking.create(newItem);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

// update an existing booking
const updateBooking = async (req, res) => {
    const bookingId = req.params.id;
    const { movein, gender, payvia, needs } = req.body;
  
    try {
      const updatedStatus = await Booking.findByIdAndUpdate(
        bookingId,
        { movein, gender, payvia, needs },
        { new: true, runValidators: true }
      );
  
      if (!updatedStatus) {
        return res.status(404).json({ message: 'Booking not found!' });
      }
  
      res.status(200).json(updatedStatus);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

// update the status of the booking
const updateStatus= async (req, res) => {
    const bookingId = req.params.id;
    const { status } = req.body;
  
    try {
      const updatedStatus = await Booking.findByIdAndUpdate(
        bookingId,
        { status },
        { new: true, runValidators: true }
      );
      if (!updatedStatus) {
        return res.status(404).json({ message: 'Booking not found!' });
      }
      res.status(200).json(updatedStatus);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

module.exports = {
    postBooking,
    getBookigsByEmail,
    updateBooking,
    updateStatus
}
