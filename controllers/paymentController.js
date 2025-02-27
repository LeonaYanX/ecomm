const { Payment, Order } = require('../models');
const sequelize = require('../config/database');


exports.processPayment = async (req, res, next) => {
    const { orderId } = req.body;
    const transaction = await sequelize.transaction();

    try {
        // Getting order
        const order = await Order.findByPk(orderId, { include: Payment, transaction });
        if (!order) {
            await transaction.rollback();
            return res.status(404).json({ success: false, message: 'Order is not found' });
        }

        // Checking status
        if (order.status !== 'pending') {
            await transaction.rollback();
            return res.status(400).json({ success: false, message: 'Order is already processed' });
        }

        // Creating (pending)
        let payment = await Payment.create({
            orderId,
            amount: order.totalAmount, // sums items in OrderItem automaticly field
            status: 'pending',
        }, { transaction });

        //Emulation of payment sys
        const paymentSuccess = Math.random() > 0.1; // 90% successful payments
        if (!paymentSuccess) {
            payment.status = 'failed';
            await payment.save({ transaction });
            await transaction.commit();
            return res.status(400).json({ success: false, message: 'Payment failed.' });
        }

        // Updateing status to completed
        payment.status = 'completed';
        await payment.save({ transaction });

        // Order status update
        order.status = 'paid';
        await order.save({ transaction });

        await transaction.commit();
        return res.status(200).json({ success: true, message: 'Paid.', payment });

    } catch (error) {
        await transaction.rollback();
        console.error('Error in processing payment', error);
        next(error);
    }
};

exports.getPaymentDetails = async (req, res, next) => {
    const { paymentId } = req.params;
    const { userId, role } = req.user; // from token

    try {
        const payment = await Payment.findByPk(paymentId, { include: Order });

        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }

        // Checking the role for access
        if (role !== 'admin' && (!payment.Order || payment.Order.userId !== userId)) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        return res.status(200).json({ success: true, payment });

    } catch (error) {
        console.error('Error in paymentDetails');
        next(error);
    }
};

// Canceling payment
exports.refundPayment = async (req, res, next) => {
    const { paymentId } = req.params;
    const transaction = await sequelize.transaction();

    try {
        const payment = await Payment.findByPk(paymentId, { include: Order, transaction });
        if (!payment) {
            await transaction.rollback();
            return res.status(404).json({ success: false, message: 'The payment is not found' });
        }

        // cheching the status of payment
        if (payment.status !== 'completed') {
            await transaction.rollback();
            return res.status(400).json({ success: false, message:'You can cancell only completed payment'});
        }

        // Updating payment status
        payment.status = 'failed';
        await payment.save({ transaction });

        // Updating order status
        const order = payment.Order;
        order.status = 'canceled';
        await order.save({ transaction });

        await transaction.commit();
        return res.status(200).json({ success: true, message: 'Payment canceled succesfully' });

    } catch (error) {
        await transaction.rollback();
        console.error('Error in cancelPayment');
        next(error);
    }
};
