const express = require("express");
const router = express.Router();
const validate = require('../middleware/validators');
const createProductRules = require('../validators/productValidator');
const {addProduct, updateProduct, 
    deleteProduct, listProducts } = require("../controllers/productController");
const roleMiddleware = require('../middleware/roleMiddleware');
const {refreshToken, verifyToken} = require('../middleware/auth');

router.use(verifyToken, refreshToken);
router.use(roleMiddleware('admin'));

router.post("/add", createProductRules, validate, addProduct);

router.put("/update/:id", createProductRules, validate, updateProduct);

router.delete("/delete/:id", deleteProduct);

router.get("/list", listProducts);

module.exports = router;
