const mongoose = require('mongoose');
const {Schema} = mongoose;

const listingSchema = new Schema({
    boarding: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    name: {
        type: String,
        trim: true,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    images: {
        type: [String]
    }, 
    amenities: {
        type: [String]
    }, 
    price: {
        type: Number,
        required: true
    },
    }, { 
        timestamps: true 
    }
);

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;