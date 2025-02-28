const express = require('express');
const authController = require('../controllers/authController');
const validate = require('../middleware/validators');
const createUserRules = require('../validators/userValidator');


const router = express.Router();

router.post('/register',createUserRules, validate, authController.register);

router.post('/',authController.login);

module.exports = router;