const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const OrderItem = require('../models/OrderItem');
const Cart = require('../models/Cart');
const Payment = require('../models/Payment');
const sequelize = require('../config/database');

exports.placeOrder = async (req, res, next)=>{
    const {userId} = req.body;
    const transaction = await sequelize.transaction();

    try {
        const user = await User.findByPk(userId, {transaction});

        if(!user){
            await transaction.rollback();
         return res.status(404).json({success: false, message: 'User not found'});
        }

        const cartItems = await Cart.findAll({
        where: {userId},
        include: Product,
        transaction});
        if(cartItems.length===0){
            await transaction.rollback();
          return res.status(400).json({success: false , message: 'Cart is empty.'});
        }

        const totalAmount = cartItems.reduce(
            (sum,item)=>sum + item.quantity*item.Product.price,0 );

        const order = await Order.create({
            userId,
            status: 'pending',
            totalAmount
            },
        {transaction});
        
        for(let item of cartItems ){
            const product = item.Product;
            if(product.stock<item.quantity){
                throw new Error('Not enough products in stock.');
            }

            product.stock-=item.quantity;
            await product.save({transaction});

            await OrderItem.create({
                orderId: order.id,
                productId: product.id,
                quantity: item.quantity
            }, {transaction});
        }

        const payment = await Payment.create({
            orderId: order.id,
            amount: totalAmount,
            status: 'pending'
        },{transaction});

        payment.status = 'completed';
        await payment.save({transaction});

        order.status = 'paid';
        await order.save({transaction});

        await Cart.destroy({where: {userId}, transaction});

        await transaction.commit();
     return res.status(201).json({success: true, message: 'Order placed successfully', order});
    } catch (error) {
        await transaction.rollback(); 
        console.error('Error in place Order', error);
        next(error);
    }
};

exports.getOrder = async(req, res, next)=>{
    const {userId, role} = req.body; // from authorization token
    try {
        let orders;
        if(role==='admin'){
            orders = await Order.findAll({include: [User, OrderItem, Payment]});
        }
        else{
            orders = await Order.findAll({where: {userId} , include: [OrderItem, Payment]});
        }
        return res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error('Error in getOrder', error);
       next(error);
    }
};

exports.cancelOrder = async(req, res, next)=>{
    const {orderId} = req.body;
    const transaction = await sequelize.transaction();

    try {
     const order = await Order.findByPk(orderId,{include:[Payment, OrderItem], transaction});
     if(!order){
        await transaction.rollback();
        return res.status(404).json({success: false , message: 'Order is not found'});
     }
     if(order.status!=='paid' && order.status !== 'pending'){
        await transaction.rollback();
        return res.status(400).json({
            success: false,
            message:'You can cancel only paid and pending order'
        });
     }

     const payment = order.Payment;
     payment.status = 'failed';
     await payment.save({transaction});

     for(let item of order.OrderItems){
        const product = await Product.findByPk(item.productId, {transaction});
        product.stock += item.quantity;
        await product.save({transaction});
     }
     order.status = 'canceled';
     await order.save({transaction});
     
     await transaction.commit();
     return res.status(200).json({ success: true, message: "Order canceled" });
    } catch (error) {
        await transaction.rollback();
        console.log('Error is in cancelOrder');
        next(error);
    }
};

exports.updateOrderStatus = async (req, res, next)=>{
    const {orderId} = req.params;
    const {status} = req.body;
    const validStatuses = ['pending', 'paid', 'shipping', 'delivered'];
    try {
        if(!validStatuses.includes(status)){
            return res.status(400).json({success: false, message:'Incorrect status'});
        }
        const order = await Order.findByPk(orderId);
        if(!order){
            return res.status(404).json({success: false, message:'Order is not found'});
        }
        order.status = status;
        await order.save();
        return res.status(200).json({ success: true, message: 'Status updated.', order });
    } catch (error) {
        console.log('Error in updating status');
        next(error);
    }
};