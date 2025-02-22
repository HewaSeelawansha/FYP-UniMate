const Registration = require("../models/registration");
const bcrypt = require('bcryptjs');

const postRegister = async (req, res) => {
    try{
        const {email, regNo} = req.body;
        const user = await Registration.findOne({ email });
        if (user) {
            return res.status(404)
                .json({ message:'Already exists', success: false})
        }
        const regModel = new Registration({email});
        regModel.regNo = await bcrypt.hash(regNo, 10);
        await regModel.save();
        res.status(201).json({message:"Registered successfully", success: true});
    } catch(error) {
        res.status(500).send({message:"Internal server eroor", success: false});
    }
}

const postLogin = async (req, res) => {
    try {
        const { email, regNo } = req.body;
        const user = await Registration.findOne({ email });
        const isRegNoEqual = await bcrypt.compare(regNo, user.regNo);
        if (!isRegNoEqual) {
            return res.status(400)
                .json({ message: 'Please provide correct registration number', success: false });
        }
        res.status(200).json({
            message: "Successfully Validated!",
            success: true,
            user: {
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).send({ message: "Internal server error", success: false });
    }
};

module.exports = {
    postRegister,
    postLogin
}