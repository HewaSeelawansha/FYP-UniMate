const Booking = require("../models/booking");

// get bookings by listing id
const getBookigsByEmail = async (req, res) => {
    try {
        const email = req.params.email;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        const query = { email: email };
        const result = await Booking.find(query).exec();
        res.status(200).json(result); 
    } catch (error) {
        console.error('Error fetching listings:', error.message);
        res.status(500).json({ message: error.message });
    }
};

// get bookings by listing id
const getBookigsByListing = async (req, res) => {
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

// get bookings by listing id and user
const getBookigsByUserListing = async (req, res) => {
  try {
      const { email, id } = req.params;
      if (!id || !email) {
          return res.status(400).json({ message: 'Listing ID and email are required' });
      }
      const query = { listing: id, email: email };
      const result = await Booking.findOne(query).exec();
      res.status(200).json(result); 
  } catch (error) {
      console.error('Error fetching bookings:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
  }
};

// post a new booking
const postBooking = async (req, res) => {
  try {
      const { email, listing } = req.body;
      if (!email || !listing) {
          return res.status(400).json({ message: "Email and listing ID are required." });
      }
      const existingBooking = await Booking.findOne({ email, listing });

      if (existingBooking) {
          return res.status(409).json({ message: "Booking already exists for this listing and email." });
      }
      const newBooking = await Booking.create(req.body);
      res.status(201).json(newBooking);
  } catch (error) {
      console.error("Error creating booking:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
  }
};

// update an existing booking
const updateBooking = async (req, res) => {
    const bookingId = req.params.id;
    const { movein, payvia, needs } = req.body;

    try {
      const updatedStatus = await Booking.findByIdAndUpdate(
        bookingId,
        { movein, payvia, needs },
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

const deleteBooking = async (req, res) => {
  const BookingId = req.params.id;
  try{
      const deletedItem = await Booking.findByIdAndDelete(BookingId);
      if(!deletedItem){
          return res.status(404).json({ message: "BookingId not found!"});
      }
      res.status(200).json({message: "BookingId deleted successfully!"});
  } catch (error) {
      res.status(500).json({message: error.message});
  }
};

module.exports = {
    postBooking,
    getBookigsByUserListing,
    getBookigsByEmail,
    getBookigsByListing,
    updateBooking,
    updateStatus,
    deleteBooking
}
