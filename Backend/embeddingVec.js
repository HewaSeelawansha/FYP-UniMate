require('dotenv').config(); // Load environment variables
const mongoose = require('mongoose');
const Listing = require('./api/models/listing'); // Adjust path as needed
const { loadModel, precomputeEmbeddings } = require('./api/controller/listingControllers'); // Adjust path
require('dotenv').config();

async function backfillEmbeddings() {
    try {
      // Connect to your DB
      const dbUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@unimate-cluster.nltol.mongodb.net/UnimateDB?retryWrites=true&w=majority&appName=Unimate-Cluster`;
      
      await mongoose.connect(dbUri);
      console.log('Connected to MongoDB');

    // Get all listings where embeddingVector is empty array or doesn't exist
    const listings = await Listing.find({
      $or: [
        { embeddingVector: { $exists: false } },
        { embeddingVector: { $eq: [] } } // Handles your default: [] case
      ]
    });

    console.log(`Found ${listings.length} listings to process`);

    // Process in batches
    const batchSize = 5; // Reduced for TensorFlow memory safety
    for (let i = 0; i < listings.length; i += batchSize) {
      const batch = listings.slice(i, i + batchSize);
      console.log(`Processing batch ${i / batchSize + 1}/${Math.ceil(listings.length / batchSize)}`);

      await Promise.all(batch.map(async (listing) => {
        try {
          await precomputeEmbeddings(listing);
          console.log(`✅ Processed listing ${listing._id}`);
        } catch (err) {
          console.error(`❌ Error processing ${listing._id}:`, err.message);
        }
      }));

      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('🎉 Embedding backfill complete!');
    process.exit(0);
  } catch (err) {
    console.error('🔥 Backfill failed:', err);
    process.exit(1);
  }
}

backfillEmbeddings();