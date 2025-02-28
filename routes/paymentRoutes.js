const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController'); // Подключаем контроллер платежей


router.post('/process', paymentController.processPayment);


router.get('/:paymentId', paymentController.getPaymentDetails);


router.post('/refund/:paymentId', paymentController.refundPayment);

module.exports = router;
