const Listing = require("../models/listing");
const Boarding = require("../models/boarding");
const { createSearchIndex, getSimilarListings, preprocessText } = require('../utils/listingNLP');

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
    const { name, description, type, images, amenities, price, keyMoney, available, status } = req.body;
  
    try {
      const updatedListing = await Listing.findByIdAndUpdate(
        listingId,
        { name, description, type, images, amenities, price, keyMoney, available, status },
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

  // update payment status
  const paymentListing = async (req, res) => {
    const listingId = req.params.id;
    const { payStatus } = req.body;
    try {
      const updatedListing = await Listing.findByIdAndUpdate(
        listingId,
        { payStatus },
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
        const result = await Listing.find(query).sort({ createdAt: -1, updatedAt: -1 }).exec();
        res.status(200).json(result); 
    } catch (error) {
        console.error('Error fetching listings:', error.message);
        res.status(500).json({ message: error.message });
    }
  };

  // search an existing listing
// const searchListing = async (req, res) => {
//     try {
//         const { q, type, sort, page = 1, limit = 10 } = req.query;
        
//         // Build base query
//         const query = { 
//           available: { $gte: 0 },
//           status: 'Approved',
//           payStatus: 'Done'
//         };

// const searchListing = async (req, res) => {
//   try {
//       const { q, type, sort, page = 1, limit = 10, gender, keyMoney } = req.query;
      
//       // First get all accepted boarding houses
//       const acceptedBoardings = await Boarding.find(
//           { status: 'Approved' },
//           { owner: 1 } // Only return the owner field
//       );

//       // Extract the owner emails from accepted boardings
//       const acceptedOwners = acceptedBoardings.map(b => b.owner);

//       // Build base query - now including owner filter
//       const query = { 
//         available: { $gte: 0 },
//         status: 'Approved',
//         payStatus: 'Done',
//         owner: { $in: acceptedOwners } // Only listings owned by accepted boarding owners
//       };
      
//       // Search functionality (for Navbar)
//       if (q) {
//         query.$or = [
//           { name: { $regex: q, $options: 'i' } },
//           { location: { $regex: q, $options: 'i' } },
//           { type: { $regex: q, $options: 'i' } },
//           { description: { $regex: q, $options: 'i' } },
//           { boarding: { $regex: q, $options: 'i' } },
//           { amenities: { $regex: q, $options: 'i' } }
//         ];
//       }
      
//       // Additional filters (for Browse page)
//       if (type && type !== 'all') {
//         query.type = type;
//       }
      
//       // Gender filter
//       if (gender && gender !== 'all') {
//         query.gender = gender;
//       }
      
//       // Key Money filter
//       if (keyMoney && keyMoney !== 'all') {
//         if (keyMoney === 'with') {
//           query.keyMoney = { $gt: 0 };
//         } else if (keyMoney === 'without') {
//           query.keyMoney = 0;
//         }
//       }

//       if (req.query.priceMin) {
//         query.price = { $gte: parseInt(req.query.priceMin) };
//       }

//       if (req.query.priceMax) {
//         query.price = query.price || {};
//         query.price.$lte = parseInt(req.query.priceMax);
//       }
      
//       if (req.query.distanceMin) {
//         query.distance = { $gte: parseInt(req.query.distanceMin) };
//       }

//       if (req.query.distanceMax) {
//         query.distance = query.distance || {};
//         query.distance.$lte = parseInt(req.query.distanceMax);
//       }
  
//       // Sorting (for Browse page)
//       let sortOption = { createdAt: -1 }; 
//       if (sort) {
//         const sortMap = {
//           'newly': { createdAt: -1 },
//           'A-Z': { name: 1 },
//           'Z-A': { name: -1 },
//           'low-high': { price: 1 },
//           'high-low': { price: -1 },
//           'd-l2h': { distance: 1 },
//           'd-h2l': { distance: -1 }
//         };
//         sortOption = sortMap[sort] || sortOption;
//       }
      
//       // Execute query
//       let results;
//       let total;
      
//       if (limit) {
//         // Paginated response
//         results = await Listing.find(query)
//           .sort(sortOption)
//           .skip((page - 1) * limit)
//           .limit(parseInt(limit));
//         total = await Listing.countDocuments(query);
//       } else {
//         // Unlimited response - get all matching documents
//         results = await Listing.find(query).sort(sortOption);
//         total = results.length;
//       }
  
//       // Different response formats
//       if (req.query.minimal) {
//         // For Navbar - simple array of results
//         res.json(results);
//       } else {
//         // For Browse page
//         const response = {
//           listings: results,
//           total,
//         };
        
//         // Only include pagination info if limit was specified
//         if (limit) {
//           response.page = parseInt(page);
//           response.pages = Math.ceil(total / limit);
//         }
        
//         res.json(response);
//       }
  
//     } catch (error) {
//       console.error('Search error:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
// };

const searchListing = async (req, res) => {
  try {
    const { q, type, sort, page = 1, limit = 10, gender, keyMoney, similarTo } = req.query;
    
    // First get all accepted boarding houses
    const acceptedBoardings = await Boarding.find(
      { status: 'Approved' },
      { owner: 1 }
    );

    const acceptedOwners = acceptedBoardings.map(b => b.owner);

    // Build base query
    const query = { 
      available: { $gte: 0 },
      status: 'Approved',
      payStatus: 'Done',
      owner: { $in: acceptedOwners }
    };
    
    // If similarTo is provided, find similar listings
    if (similarTo) {
      try {
        const targetListing = await Listing.findById(similarTo).populate('boardingID');
        if (!targetListing) {
          return res.status(404).json({ error: 'Listing not found' });
        }
        
        const allListings = await Listing.find(query).populate('boardingID');
        const tfidf = createSearchIndex(allListings);
        const similarListings = getSimilarListings(targetListing, allListings, tfidf);
        
        return res.json({
          listings: similarListings,
          total: similarListings.length,
          message: 'Similar listings found'
        });
      } catch (err) {
        console.error('Similar listings error:', err);
        return res.status(500).json({ error: 'Error finding similar listings' });
      }
    }
    
    // Regular search functionality - now includes boarding fields
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { type: { $regex: q, $options: 'i' } },
        { 'boardingID.name': { $regex: q, $options: 'i' } },
        { 'boardingID.address': { $regex: q, $options: 'i' } },
        { 'boardingID.description': { $regex: q, $options: 'i' } }
      ];
    }
    
    // Additional filters
    if (type && type !== 'all') query.type = type;
    if (gender && gender !== 'all') query.gender = gender;
    
    if (keyMoney && keyMoney !== 'all') {
      query.keyMoney = keyMoney === 'with' ? { $gt: 0 } : 0;
    }

    if (req.query.priceMin) query.price = { $gte: parseInt(req.query.priceMin) };
    if (req.query.priceMax) {
      query.price = query.price || {};
      query.price.$lte = parseInt(req.query.priceMax);
    }
    
    if (req.query.distanceMin) query.distance = { $gte: parseInt(req.query.distanceMin) };
    if (req.query.distanceMax) {
      query.distance = query.distance || {};
      query.distance.$lte = parseInt(req.query.distanceMax);
    }

    // Sorting options
    const sortMap = {
      'newly': { createdAt: -1 },
      'A-Z': { name: 1 },
      'Z-A': { name: -1 },
      'low-high': { price: 1 },
      'high-low': { price: -1 },
      'd-l2h': { distance: 1 },
      'd-h2l': { distance: -1 }
    };
    const sortOption = sortMap[sort] || { createdAt: -1 };
    
    // Execute query with population
    let results, total;
    
    if (limit) {
      results = await Listing.find(query)
        .populate('boardingID')
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
      total = await Listing.countDocuments(query);
    } else {
      results = await Listing.find(query)
        .populate('boardingID')
        .sort(sortOption);
      total = results.length;
    }
    
    // Enhanced TF-IDF ranking that includes boarding data
    if (q && results.length > 0) {
      const tfidf = createSearchIndex(results);
      const searchTerms = preprocessText(q);
      
      const scoredResults = results.map(listing => {
        let score = 0;
        
        // Score for individual terms
        searchTerms.split(' ').forEach(term => {
          tfidf.tfidfs(term, (i, measure) => {
            if (i === results.indexOf(listing)) score += measure;
          });
        });
        
        // Bonus for exact matches in listing
        if (listing.name.toLowerCase().includes(q.toLowerCase())) {
          score += 2.0;
        }
        // Bonus for exact matches in boarding
        if (listing.boardingID?.name.toLowerCase().includes(q.toLowerCase())) {
          score += 1.5;
        }
        if (listing.boardingID?.address.toLowerCase().includes(q.toLowerCase())) {
          score += 1.5;
        }
        
        return { ...listing._doc, relevanceScore: score };
      });
      
      results = scoredResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
    }

    // Response formatting
    const response = {
      listings: results,
      total,
    };
    
    if (limit) {
      response.page = parseInt(page);
      response.pages = Math.ceil(total / limit);
    }
    
    res.json(req.query.minimal ? results : response);

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
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
    statusListing,
    paymentListing
}