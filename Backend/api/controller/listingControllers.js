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
        const result = await Listing.find(query).sort({ createdAt: -1 }).exec();
        res.status(200).json(result); 
    } catch (error) {
        console.error('Error fetching listings:', error.message);
        res.status(500).json({ message: error.message });
    }
  };

const searchListing = async (req, res) => {
  try {
    const { q, type, sort, page = 1, limit = 10, gender, keyMoney, similarTo } = req.query;
    
    const acceptedBoardings = await Boarding.find(
      { status: 'Approved' },
      { owner: 1 }
    );

    const acceptedOwners = acceptedBoardings.map(b => b.owner);

    const query = { 
      available: { $gte: 1 },
      status: 'Approved',
      payStatus: 'Done',
      owner: { $in: acceptedOwners }
    };
    
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

    const pipeline = [
      { $match: query },
      { $lookup: {
          from: 'boardings',
          localField: 'boardingID',
          foreignField: '_id',
          as: 'boardingData'
      }},
      { $unwind: '$boardingData' }
    ];

    if (q) {
      const searchWords = q.split(' ').filter(word => word.length > 0);
      const regexPatterns = searchWords.map(word => new RegExp(word, 'i'));
      
      pipeline.push({
        $match: {
          $or: [
            { name: { $in: regexPatterns } },
            { description: { $in: regexPatterns } },
            { owner: { $in: regexPatterns } },
            { amenities: { $in: regexPatterns } },
            { boarding: { $in: regexPatterns } },
            { 'boardingData.name': { $in: regexPatterns } },
            { 'boardingData.address': { $in: regexPatterns } },
            { 'boardingData.description': { $in: regexPatterns } }
          ]
        }
      });
    }

    const countPipeline = [...pipeline, { $count: 'total' }];
    const totalResult = await Listing.aggregate(countPipeline);
    const total = totalResult[0]?.total || 0;

    pipeline.push({ $sort: sortOption });
    
    if (limit) {
      pipeline.push(
        { $skip: (page - 1) * limit },
        { $limit: parseInt(limit) }
      );
    }

    let results = await Listing.aggregate(pipeline);

    if (q && results.length > 0) {
      const tfidf = createSearchIndex(results);
      const searchTerms = preprocessText(q);
      const searchWords = q.toLowerCase().split(' ');
      
      const scoredResults = results.map(listing => {
        let score = 0;
        
        const listingText = [
          listing.name,
          listing.description,
          listing.type,
          listing.boardingData?.name || '',
          listing.boardingData?.address || '',
          listing.boardingData?.description || '',
          ...(listing.amenities || []),
          ...(listing.boardingData?.amenities || [])
        ].filter(Boolean).join(' ').toLowerCase();
        
        const listingPreprocessed = preprocessText(listingText);
        
        searchTerms.split(' ').forEach(term => {
          tfidf.tfidfs(term, (i, measure) => {
            if (i === results.indexOf(listing)) score += measure;
          });
          
          if (listingPreprocessed.includes(term)) {
            score += 0.7;
          }
        });
        
        searchWords.forEach(word => {
          if (listing.name.toLowerCase().includes(word)) {
            score += 1.5;
          }
          
          if (listing.boardingData?.name.toLowerCase().includes(word)) {
            score += 1.2;
          }
          
          if (listing.boardingData?.address.toLowerCase().includes(word)) {
            score += 1.8;
          }
          
          if (listing.type.toLowerCase().includes(word)) {
            score += 1.0;
          }
        });
        
        const allTermsMatch = searchTerms.split(' ').every(term => 
          listingPreprocessed.includes(term)
        );
        if (allTermsMatch) {
          score += 2.0;
        }
        
        if (listingText.includes(q.toLowerCase())) {
          score += 3.0;
        }
        
        if (listing.boardingData?.address) {
          const addressTerms = preprocessText(listing.boardingData.address).split(' ');
          searchTerms.split(' ').forEach(term => {
            if (addressTerms.includes(term)) {
              score += 1.5;
            }
          });
        }
        
        return { ...listing, relevanceScore: score };
      });
      
      results = scoredResults.sort((a, b) => {
        if (b.relevanceScore !== a.relevanceScore) {
          return b.relevanceScore - a.relevanceScore;
        }
        const sortField = Object.keys(sortOption)[0];
        const sortDirection = sortOption[sortField];
        return sortDirection === 1 ? 
          (a[sortField] > b[sortField] ? 1 : -1) :
          (a[sortField] < b[sortField] ? 1 : -1);
      });
    }

    const response = {
      listings: results,
      total,
    };
    
    if (limit) {
      response.page = parseInt(page);
      response.pages = Math.ceil(total / limit);
    }
    
    if (req.query.debug) {
      response.searchTerms = q ? preprocessText(q) : null;
      response.scoringExplanation = "Results are scored based on term frequency, exact matches, location terms, and type matches";
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