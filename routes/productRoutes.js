const express = require("express");
const router = express.Router();
const validate = require('../middleware/validators');
const createProductRules = require('../validators/productValidator');
const productController = require("../controllers/productController");
const roleMiddleware = require('../middleware/roleMiddleware');
const {refreshToken, verifyToken} = require('../middleware/auth');

router.use(verifyToken, refreshToken);
router.use(roleMiddleware('admin'));

router.post("/add", createProductRules, validate, productController.addProduct);

router.put("/update/:id", createProductRules, validate, productController.updateProduct);

router.delete("/delete/:id", productController.deleteProduct);

router.get("/list", productController.listProducts);

module.exports = router;
