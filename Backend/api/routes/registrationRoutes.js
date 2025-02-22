const express = require('express');
const router = express.Router();
const Registration = require("../models/registration");
const registrationController = require('../controller/registrationControllers')
const verifyAdmin = require('../middleware/verifyAdmin');

router.post("/adduser", verifyAdmin, registrationController.postRegister);
router.post("/validate", registrationController.postLogin);

module.exports = router;

