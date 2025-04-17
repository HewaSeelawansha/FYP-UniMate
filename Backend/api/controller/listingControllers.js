const Listing = require("../models/listing");

// get all listings
const getAllListings = async (req, res) => {
    try{
        const listings = await Listing.find({}).sort({createdAt: -1});
        res.status(200).json(listings);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

// post a new listing
const postListing = async (req, res) => {
    const newItem = req.body;
    try{
        const result = await Listing.create(newItem);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

// delete a listing
const deleteListing = async (req, res) => {
    const listingId = req.params.id;
    try{
        const deletedItem = await Listing.findByIdAndDelete(listingId);
        if(!deletedItem){
            return res.status(404).json({ message: "Listing not found!"});
        }
        res.status(200).json({message: "Listing deleted successfully!"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// get single listing
const singleListing = async (req, res) => {
    const listingId = req.params.id;
    try {
        const listing = await Listing.findById(listingId);
        res.status(200).json(listing)
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// update an existing listing
const updateListing = async (req, res) => {
    const listingId = req.params.id;
    const { name, description, type, images, amenities, price, keyMoney, available } = req.body;
  
    try {
      const updatedListing = await Listing.findByIdAndUpdate(
        listingId,
        { name, description, type, images, amenities, price, keyMoney, available },
        { new: true, runValidators: true }
      );
  
      if (!updatedListing) {
        return res.status(404).json({ message: 'Listing not found!' });
      }
  
      res.status(200).json(updatedListing);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // update listing status
  const statusListing = async (req, res) => {
    const listingId = req.params.id;
    const { status } = req.body;
    try {
      const updatedListing = await Listing.findByIdAndUpdate(
        listingId,
        { status },
        { new: true, runValidators: true }
      );
      if (!updatedListing) {
        return res.status(404).json({ message: "Listing not found!" });
      }
      res.status(200).json({boarding: updatedListing});
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // get listings items by email
  const getListingsByEmail = async (req, res) => {
    try {
        const email = req.query.email;
        const query = { owner: email };
        const result = await Listing.find(query).exec();
        res.status(200).json(result); 
    } catch (error) {
        console.error('Error fetching listings:', error.message);
        res.status(500).json({ message: error.message });
    }
  };

  // search an existing listing
const searchListing = async (req, res) => {
    try {
        const { q, type, sort, page = 1, limit = 10 } = req.query;
        
        // Build base query
        const query = { available: { $gte: 0 } };
        
        // Search functionality (for Navbar)
        if (q) {
          query.$or = [
            { name: { $regex: q, $options: 'i' } },
            { location: { $regex: q, $options: 'i' } },
            { type: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { boarding: { $regex: q, $options: 'i' } },
            { amenities: { $regex: q, $options: 'i' } }
          ];
        }
        
        // Additional filters (for Browse page)
        if (type && type !== 'all') {
          query.type = type;
        }
    
        // Sorting (for Browse page)
        let sortOption = { createdAt: -1 }; // Default
        if (sort) {
          const sortMap = {
            'newly': { createdAt: -1 },
            'A-Z': { name: 1 },
            'Z-A': { name: -1 },
            'low-high': { price: 1 },
            'high-low': { price: -1 },
            'd-l2h': { distance: 1 },
            'd-h2l': { distance: -1 }
          };
          sortOption = sortMap[sort] || sortOption;
        }
    
        // Execute query
        const results = await Listing.find(query)
          .sort(sortOption)
          .skip((page - 1) * limit)
          .limit(parseInt(limit));
    
        // Different response formats
        if (req.query.minimal) {
          // For Navbar - simple array of results
          res.json(results);
        } else {
          // For Browse page - paginated response
          const total = await Listing.countDocuments(query);
          res.json({
            listings: results,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit)
          });
        }
    
      } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
  };

module.exports = {
    getAllListings,
    postListing,
    deleteListing,
    singleListing,
    updateListing,
    getListingsByEmail,
    searchListing,
    statusListing
}
