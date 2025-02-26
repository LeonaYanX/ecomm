const express = require('express');
const {register, login} = require('../controllers/authController');
const validate = require('../middleware/validators');
const createUserRules = require('../validators/userValidator');


const router = express.Router();

router.post('/register',createUserRules, validate, register);

router.post('/',login);

module.exports = router;