const Listing = require("../models/listing");
const Boarding = require("../models/boarding");
const tf = require('@tensorflow/tfjs');
const use = require('@tensorflow-models/universal-sentence-encoder');

// Global model variable (cached after first load)
let sentenceEncoder;

// Function to load the TensorFlow model
const loadModel = async () => {
  if (!sentenceEncoder) {
    // console.log('Loading Universal Sentence Encoder...');
    sentenceEncoder = await use.load();
    // console.log('Model loaded successfully');
  }
  return sentenceEncoder;
};

// Helper function to calculate cosine similarity
const calculateCosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
  
  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
};

const generateSemanticRecommendations = async (searchQuery, listings) => {
  try {
    const model = await loadModel();
    const queryEmbedding = await model.embed(searchQuery);
    const queryVector = await queryEmbedding.array();
    
    // Get listings with their embeddings (need to explicitly select it)
    const listingsWithVectors = await Listing.find({
      _id: { $in: listings.map(l => l._id) }
    }).select('+embeddingVector');
    
    const listingsWithScores = listingsWithVectors.map(listing => {
      const similarity = calculateCosineSimilarity(
        queryVector[0], 
        listing.embeddingVector
      );
      
      return {
        ...listing.toObject(),
        similarityScore: similarity
      };
    });
    
    return listingsWithScores
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, 5);
  } catch (error) {
    // console.error('Error:', error);
    return [];
  }
};

// Precompute and save embeddings when creating/updating listings
const precomputeEmbeddings = async (listing) => {
  try {
    const model = await loadModel();
    const text = `${listing.name} ${listing.type} ${listing.location} ${listing.description} ${listing.boarding} ${listing.amenities}`;
    const embedding = await model.embed(text);
    const vector = await embedding.array();
    
    // Update listing with embedding vector
    await Listing.findByIdAndUpdate(
      listing._id,
      { embeddingVector: vector[0] },
      { new: true }
    );
  } catch (error) {
    // console.error('Error precomputing embeddings:', error);
  }
};

// get all listings
const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find({}).sort({ createdAt: -1 });
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// post a new listing
const postListing = async (req, res) => {
  const newItem = req.body;
  try {
    const result = await Listing.create(newItem);
    // Precompute embeddings for new listing
    await precomputeEmbeddings(result);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// delete a listing
const deleteListing = async (req, res) => {
  const listingId = req.params.id;
  try {
    const deletedItem = await Listing.findByIdAndDelete(listingId);
    if (!deletedItem) {
      return res.status(404).json({ message: "Listing not found!" });
    }
    res.status(200).json({ message: "Listing deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get single listing
const singleListing = async (req, res) => {
  const listingId = req.params.id;
  try {
    const listing = await Listing.findById(listingId);
    res.status(200).json(listing);
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

    // Recompute embeddings if relevant fields changed
    if (name || description || type || location) {
      await precomputeEmbeddings(updatedListing);
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
    res.status(200).json({ boarding: updatedListing });
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
    res.status(200).json({ boarding: updatedListing });
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

// search an existing listing with recommendations
const searchListing = async (req, res) => {
  try {
    const { q, type, sort, page = 1, limit = 10, gender, keyMoney } = req.query;

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

    // Search functionality
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

    // Additional filters
    if (type && type !== 'all') {
      query.type = type;
    }

    if (gender && gender !== 'all') {
      query.gender = gender;
    }

    if (keyMoney && keyMoney !== 'all') {
      if (keyMoney === 'with') {
        query.keyMoney = { $gt: 0 };
      } else if (keyMoney === 'without') {
        query.keyMoney = 0;
      }
    }

    if (req.query.priceMin) {
      query.price = { $gte: parseInt(req.query.priceMin) };
    }

    if (req.query.priceMax) {
      query.price = query.price || {};
      query.price.$lte = parseInt(req.query.priceMax);
    }

    if (req.query.distanceMin) {
      query.distance = { $gte: parseInt(req.query.distanceMin) };
    }

    if (req.query.distanceMax) {
      query.distance = query.distance || {};
      query.distance.$lte = parseInt(req.query.distanceMax);
    }

    // Sorting
    let sortOption = { createdAt: -1 };
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
    let results;
    let total;
    let recommendations = [];

    if (limit) {
      results = await Listing.find(query)
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
      total = await Listing.countDocuments(query);
    } else {
      results = await Listing.find(query).sort(sortOption);
      total = results.length;
    }

    // Generate recommendations if search query exists
    if (q) {
      recommendations = await generateSemanticRecommendations(q, results);
    }

    // Response format
    if (req.query.minimal) {
      res.json(results);
    } else {
      const response = {
        listings: results,
        total,
        recommendations
      };

      if (limit) {
        response.page = parseInt(page);
        response.pages = Math.ceil(total / limit);
      }

      res.json(response);
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
  statusListing,
  paymentListing,
  precomputeEmbeddings,
  loadModel
};



// const Listing = require("../models/listing");
// const Boarding = require("../models/boarding")

// // get all listings
// const getAllListings = async (req, res) => {
//     try{
//         const listings = await Listing.find({}).sort({createdAt: -1});
//         res.status(200).json(listings);
//     } catch (error) {
//         res.status(500).json({message: error.message});
//     }
// }

// // post a new listing
// const postListing = async (req, res) => {
//     const newItem = req.body;
//     try{
//         const result = await Listing.create(newItem);
//         res.status(201).json(result);
//     } catch (error) {
//         res.status(400).json({message: error.message});
//     }
// }

// // delete a listing
// const deleteListing = async (req, res) => {
//     const listingId = req.params.id;
//     try{
//         const deletedItem = await Listing.findByIdAndDelete(listingId);
//         if(!deletedItem){
//             return res.status(404).json({ message: "Listing not found!"});
//         }
//         res.status(200).json({message: "Listing deleted successfully!"});
//     } catch (error) {
//         res.status(500).json({message: error.message});
//     }
// };

// // get single listing
// const singleListing = async (req, res) => {
//     const listingId = req.params.id;
//     try {
//         const listing = await Listing.findById(listingId);
//         res.status(200).json(listing)
        
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // update an existing listing
// const updateListing = async (req, res) => {
//     const listingId = req.params.id;
//     const { name, description, type, images, amenities, price, keyMoney, available, status } = req.body;
  
//     try {
//       const updatedListing = await Listing.findByIdAndUpdate(
//         listingId,
//         { name, description, type, images, amenities, price, keyMoney, available, status },
//         { new: true, runValidators: true }
//       );
  
//       if (!updatedListing) {
//         return res.status(404).json({ message: 'Listing not found!' });
//       }
  
//       res.status(200).json(updatedListing);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   };

//   // update listing status
//   const statusListing = async (req, res) => {
//     const listingId = req.params.id;
//     const { status } = req.body;
//     try {
//       const updatedListing = await Listing.findByIdAndUpdate(
//         listingId,
//         { status },
//         { new: true, runValidators: true }
//       );
//       if (!updatedListing) {
//         return res.status(404).json({ message: "Listing not found!" });
//       }
//       res.status(200).json({boarding: updatedListing});
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   };

//   // update payment status
//   const paymentListing = async (req, res) => {
//     const listingId = req.params.id;
//     const { payStatus } = req.body;
//     try {
//       const updatedListing = await Listing.findByIdAndUpdate(
//         listingId,
//         { payStatus },
//         { new: true, runValidators: true }
//       );
//       if (!updatedListing) {
//         return res.status(404).json({ message: "Listing not found!" });
//       }
//       res.status(200).json({boarding: updatedListing});
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   };

//   // get listings items by email
//   const getListingsByEmail = async (req, res) => {
//     try {
//         const email = req.query.email;
//         const query = { owner: email };
//         const result = await Listing.find(query).sort({ createdAt: -1, updatedAt: -1 }).exec();
//         res.status(200).json(result); 
//     } catch (error) {
//         console.error('Error fetching listings:', error.message);
//         res.status(500).json({ message: error.message });
//     }
//   };

//   // search an existing listing
// // const searchListing = async (req, res) => {
// //     try {
// //         const { q, type, sort, page = 1, limit = 10 } = req.query;
        
// //         // Build base query
// //         const query = { 
// //           available: { $gte: 0 },
// //           status: 'Approved',
// //           payStatus: 'Done'
// //         };

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

// module.exports = {
//     getAllListings,
//     postListing,
//     deleteListing,
//     singleListing,
//     updateListing,
//     getListingsByEmail,
//     searchListing,
//     statusListing,
//     paymentListing
// }
