const Listing = require("../models/listing");

// get all menu items
const getAllListings = async (req, res) => {
    try{
        const listings = await Listing.find({}).sort({createdAt: -1});
        res.status(200).json(listings);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

// post a new menu item
const postListing = async (req, res) => {
    const newItem = req.body;
    try{
        const result = await Listing.create(newItem);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

// delete a menu item
const deleteListing = async (req, res) => {
    const listingId = req.params.id;
    try{
        const deletedItem = await Listing.findByIdAndDelete(listingId);
        if(!deletedItem){
            return res.status(404).json({ message: "Menu item not found!"});
        }
        res.status(200).json({message: "Menu item deleted successfully!"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// get single menu item
const singleListing = async (req, res) => {
    const listingId = req.params.id;
    try {
        const listing = await Listing.findById(listingId);
        res.status(200).json(listing)
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// update an existing menu item
const updateListing = async (req, res) => {
    const listingId = req.params.id;
    const { name, description, type, images, amenities, price, available } = req.body;
  
    try {
      const updatedListing = await Listing.findByIdAndUpdate(
        listingId,
        { name, description, type, images, amenities, price, available },
        { new: true, runValidators: true }
      );
  
      if (!updatedListing) {
        return res.status(404).json({ message: 'Menu item not found!' });
      }
  
      res.status(200).json(updatedListing);
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


// update an existing menu item 

module.exports = {
    getAllListings,
    postListing,
    deleteListing,
    singleListing,
    updateListing,
    getListingsByEmail
}
