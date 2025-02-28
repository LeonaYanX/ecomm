const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController'); 


router.post('/place', orderController.placeOrder);


router.get('/get', orderController.getOrder);


router.post('/cancel', orderController.cancelOrder);


router.put('/update/:orderId', orderController.updateOrderStatus);

module.exports = router;
