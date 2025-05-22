const User = require("../models/users");

// get all users
const getAllUsers = async (req, res) => {
    try{
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

// post a new user
const createUser = async (req, res) => {
    const user = req.body;
    const query = {email: user.email}
    try {
        const existingUser = await User.findOne(query);
        if (existingUser) {
            return res.status(302).json({ message: "User already exists!" });
        }
        const result = await User.create(user)
        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

//delete an existing user
const deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        if(!deletedUser){
            return res.status(404).json({ message: "User not found!" });
        }
        res.status(200).json({message: "User deleted successfully!"})
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

//get user by id
const getUser = async (req, res) => {
    const email = req.params.email;
    try {
        const user = await User.findOne({email: email});
        if(!user){
            return res.status(404).json({ message: "User not found!" });
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

//get an admin account
const getAdmin = async (req, res) => {
    const email = req.params.email;
    const query = {email: email};
    try {
        const user = await User.findOne(query);
        if(email !== req.decoded.email){
            return res.status(403).json({message: "Forbidden access!"})
        }
        let admin = false;
        if(user){
            admin = user?.role === "admin";
        }
        res.status(200).json({admin})
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

//make an admin account
const makeAdmin = async (req, res) => {
    const userId = req.params.id;
    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {role: "admin"},
            {new: true, runValidators: true}
        )
    if(!updatedUser){
            return res.status(404).json({ message: "User not found!" });
    }
    res.status(200).json(updatedUser)
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

//get an owner account
const getOwner = async (req, res) => {
    const email = req.params.email;
    const query = {email: email};
    try {
        const user = await User.findOne(query);
        if(email !== req.decoded.email){
            return res.status(403).json({message: "Forbidden access!"})
        }
        let owner = false;
        if(user){
            owner = user?.role === "owner";
        }
        res.status(200).json({owner})
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

//make an owner account
const makeOwner = async (req, res) => {
    const userId = req.params.id;
    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {role: "owner"},
            {new: true, runValidators: true}
        )
    if(!updatedUser){
            return res.status(404).json({ message: "User not found!" });
    }
    res.status(200).json(updatedUser)
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

//get an user account
const getNUser = async (req, res) => {
    const email = req.params.email;
    const query = {email: email};
    try {
        const nuser = await User.findOne(query);
        if(email !== req.decoded.email){
            return res.status(403).json({message: "Forbidden access!"})
        }
        let user = false;
        if(nuser){
            user = nuser?.role === "user";
        }
        res.status(200).json({user})
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

//update user
const updateUser = async (req, res) => {
    const userId = req.params.id;
    const { name, photoURL } = req.body;
  
    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, photoURL },
        { new: true, runValidators: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found!' });
      }
  
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

//update roommate
const updateRoommate = async (req, res) => {
    const userId = req.params.id;
    const { roommate, gender } = req.body;
  
    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { roommate, gender },
        { new: true, runValidators: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found!' });
      }
  
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

//get users who looking for a roommate
const getRUsers = async (req, res) => {
    const email = req.params.email;
    try{
        const query = { email: { $ne: email }, roommate: 'yes', role: 'user' };
        const users = await User.find(query).exec();
        if (!users) {
            return res.status(404).json({ message: 'No users found!' });
          }
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports = {
    getAllUsers,
    createUser,
    deleteUser,
    getAdmin,
    makeAdmin,
    getOwner,
    makeOwner,
    getUser,
    getNUser,
    updateUser,
    updateRoommate,
    getRUsers
}