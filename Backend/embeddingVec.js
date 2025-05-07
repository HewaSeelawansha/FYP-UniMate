require('dotenv').config();
const mongoose = require('mongoose');
const Listing = require('./api/models/listing');
const Boarding = require('./api/models/boarding'); // Add this model
// const { loadModel, precomputeEmbeddings } = require('./api/controller/listingControllers'); // Not needed here

async function backfillBoardingIds() {
  try {
    // Connect to your MongoDB
    const dbUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@unimate-cluster.nltol.mongodb.net/UnimateDB?retryWrites=true&w=majority&appName=Unimate-Cluster`;
    await mongoose.connect(dbUri);
    console.log('✅ Connected to MongoDB');

    // Find listings missing boardingId
    const listings = await Listing.find({
      $or: [{ boardingId: { $exists: false } }, { boardingId: null }]
    });

    console.log(`📄 Found ${listings.length} listings without boardingId`);

    for (const listing of listings) {
      try {
        const boarding = await Boarding.findOne({ name: listing.boarding });

        if (boarding) {
          listing.boardingID = boarding._id;
          await listing.save();
          console.log(`🔗 Linked listing '${listing.name}' to boarding '${boarding.name}'`);
        } else {
          console.warn(`⚠️ No boarding found for listing: '${listing.name}' (boarding: '${listing.boarding}')`);
        }
      } catch (err) {
        console.error(`❌ Error processing listing ${listing._id}:`, err.message);
      }
    }

    console.log('🎉 BoardingId backfill complete!');
    process.exit(0);
  } catch (err) {
    console.error('🔥 Failed to backfill boardingIds:', err);
    process.exit(1);
  }
}

backfillBoardingIds();
