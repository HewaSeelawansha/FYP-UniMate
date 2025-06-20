const mongoose = require('mongoose');
const {Schema} = mongoose;

const listingSchema = new Schema({
    boarding: {
        type: String,
        required: true
    },
    boardingID: {
        type: Schema.Types.ObjectId,
        ref: 'Boarding',
        required: true
    },
    distance: {
        type: Number,
        required: true,
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
    keyMoney: {
        type: Number,
        default: 0,
    },
    rating: {
        type: Number,
        default: 0
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    available: {
        type: Number,
        default: 0
    },
    payStatus: {
        type: String,
        enum: ['Done', 'Not Yet'],
        default: 'Not Yet'
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    }
}, { 
    timestamps: true 
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;