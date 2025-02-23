const jwt = require('jsonwebtoken');
const User = require('../models/users');

const verifyOwner = async (req, res, next) => {
    const email = req.decoded.email;
    const query ={email: email};

    const user = await User.findOne(query);
    const isOwner = user?.role == 'owner';

    if(!isOwner){
        return res.status(403).send({message: "forbidden access!"})
    }

    next();
};

module.exports = verifyOwner;