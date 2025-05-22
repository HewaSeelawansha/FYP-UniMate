const Boarding = require("../models/boarding");
const Listing = require("../models/listing");
const User = require("../models/users");

// get all boardings
const getAllBoardings = async (req, res) => {
    try{
        const boardings = await Boarding.find({}).sort({createdAt: -1});
        res.status(200).json(boardings);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

// post a new boarding
const postBoarding = async (req, res) => {
    const newItem = req.body;
    const query = {owner: newItem.owner}
    try{
        const existingBoarding = await Boarding.findOne(query);
        if (existingBoarding) {
            return res.status(302).json({ message: "Boarding house exists!" });
        }
        const result = await Boarding.create(newItem);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

// delete a boarding
const deleteBoarding = async (req, res) => {
    const boardingId = req.params.id;
    try{
        const deletedItem = await Boarding.findByIdAndDelete(boardingId);
        if(!deletedItem){
            return res.status(404).json({ message: "Boarding not found!"});
        }
        res.status(200).json({message: "Boarding deleted successfully!"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// get single boarding
const singleBoarding = async (req, res) => {
    const boardingId = req.params.id;
    try {
        const boarding = await Boarding.findById(boardingId);
        res.status(200).json(boarding)
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// update an existing boarding
const updateBoarding = async (req, res) => {
  const boardingId = req.params.id;
  const { name, address, lng, lat, distance, phone, gender, description, images, amenities, beds, status } = req.body;

  try {
    const currentBoarding = await Boarding.findById(boardingId);
    if (!currentBoarding) {
      return res.status(404).json({ message: 'Boarding not found!' });
    }

    const updatedBoarding = await Boarding.findByIdAndUpdate(
      boardingId,
      { name, address, lng, lat, distance, phone, gender, description, images, amenities, beds, status },
      { new: true, runValidators: true }
    );

    if (distance && distance !== currentBoarding.distance) {
      await Listing.updateMany(
        { owner: updatedBoarding.owner },
        { $set: { distance: distance } }
      );
    }

    res.status(200).json({
      boarding: updatedBoarding,
      message: distance !== currentBoarding.distance 
        ? 'Boarding and associated listings updated successfully' 
        : 'Boarding updated successfully',
      updatedListingsCount: distance !== currentBoarding.distance 
        ? (await Listing.countDocuments({ owner: updatedBoarding.owner })) 
        : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const statusBoarding = async (req, res) => {
    const boardingId = req.params.id;
    const { status } = req.body;
    try {
      const updatedBoarding = await Boarding.findByIdAndUpdate(
        boardingId,
        { status },
        { new: true, runValidators: true }
      );
      if (!updatedBoarding) {
        return res.status(404).json({ message: "Boarding not found!" });
      }
      if (status === "Approved") {
        const user = await User.findOne({ email: updatedBoarding.owner });
        if (!user) {
          return res.status(404).json({ message: "User not found!" });
        }
        const updatedUser = await User.findByIdAndUpdate(
          user._id,
          { role: "owner" },
          { new: true, runValidators: true }
        );
  
        if (!updatedUser) {
          return res.status(404).json({ message: "User not found!" });
        }
        res.status(200).json({
          boarding: updatedBoarding,
          user: updatedUser,
        });
      } else {
        res.status(200).json({
          boarding: updatedBoarding,
        });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

// get single boarding with owner
const ownerBoarding = async (req, res) => {
    try {
        const boardingOwner = req.params.owner; // Access the owner parameter
        const query = { owner: boardingOwner }; // Query by the 'owner' field
        const result = await Boarding.findOne(query).exec();
        res.status(200).json(result);
    } catch (error) {
        console.error('Error Fetching Boarding!', error.message);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllBoardings,
    postBoarding,
    deleteBoarding,
    singleBoarding,
    updateBoarding,
    ownerBoarding,
    statusBoarding
}
