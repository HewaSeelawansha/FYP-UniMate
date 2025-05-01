const Booking = require("../models/booking");
const Listing = require("../models/listing");

// get bookings by listing id
const getBookigsByEmail = async (req, res) => {
    try {
        const email = req.params.email;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        const query = { email: email };
        const bookings = await Booking.find(query)
        .sort({createdAt: -1})
        .populate('listing') 
        .exec();
        res.status(200).json(bookings); 
    } catch (error) {
        console.error('Error fetching booking:', error.message);
        res.status(500).json({ message: error.message });
    }
};

// get all bookings for admin
const getAllBookings = async (req, res) => {
  try{
      const bookings = await Booking.find({})
      .sort({createdAt: -1})
      .populate('listing') 
      .exec();
      
      res.status(200).json(bookings);
  } catch (error) {
      res.status(500).json({message: error.message});
  }
}

// get bookings by property owner
const getBookingsByOwner = async (req, res) => {
  try {
      const ownerEmail = req.params.email;
      if (!ownerEmail) {
          return res.status(400).json({ message: 'Email is required' });
      }
      const bookings = await Booking.find()
          .populate({
              path: 'listing',
              select: 'owner title location price', // Include necessary listing details
              match: { owner: ownerEmail }
          })
          .sort({ createdAt: -1, updatedAt: -1 }).exec();
      
      const filteredBookings = bookings.filter(booking => booking.listing);
      
      if (!filteredBookings.length) {
          return res.status(404).json({ message: 'No bookings found for this owner' });
      }
      
      res.status(200).json({
          bookings: filteredBookings
      });
  } catch (error) {
      console.error('Error fetching booking:', error);
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
      const bookings = await Booking.findOne(query).exec();
      res.status(200).json(bookings); 
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
    const { movein, payvia, needs, status } = req.body;

    try {
      const updatedStatus = await Booking.findByIdAndUpdate(
        bookingId,
        { movein, payvia, needs, status },
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
// const updateStatus= async (req, res) => {
//     const bookingId = req.params.id;
//     const { status } = req.body;
  
//     try {
//       const updatedStatus = await Booking.findByIdAndUpdate(
//         bookingId,
//         { status },
//         { new: true, runValidators: true }
//       );
//       if (!updatedStatus) {
//         return res.status(404).json({ message: 'Booking not found!' });
//       }
//       res.status(200).json(updatedStatus);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
// };

const updateStatus = async (req, res) => {
  const bookingId = req.params.id;
  const { status } = req.body;

  try {
    // First update the booking status
    const updatedStatus = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!updatedStatus) {
      return res.status(404).json({ message: 'Booking not found!' });
    }

    // If status is being updated to 'Approved', decrement available count
    if (status === 'Approved') {
      const listingId = updatedStatus.listing;
      
      // Find the listing and decrement available count by 1
      const updatedListing = await Listing.findByIdAndUpdate(
        listingId,
        { $inc: { available: -1 } }, // Decrement by 1
        { new: true, runValidators: true }
      );

      if (!updatedListing) {
        return res.status(404).json({ message: 'Listing not found!' });
      }
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
    getBookingsByOwner,
    updateBooking,
    updateStatus,
    deleteBooking,
    getAllBookings
}
