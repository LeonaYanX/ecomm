const Product = require('../models/Product');
const {validationResult} = require('express-validator');

exports.addProduct = async (req, res, next)=>{
    const {name, description, price, stock} = req.body;
    const sequelize = Product.sequelize;
    const transaction =await sequelize.transaction();

    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            await transaction.rollback();
            return res.status(400).json({success: false, errors:errors.array()});
        }

        const newProduct = await Product.create({name, description, price, stock},
            {transaction});
            await transaction.commit();
            return res.status(201).json({
                success: true, 
                message: 'New product added!',
                newProduct
            });
    } catch (error) {
        await transaction.rollback();
        console.log('Error in addProduct');
        next(error);
    }
};

exports.updateProduct = async (req, res, next)=>{
    const {id} = req.params;
    const {name, description, price, stock} = req.body;
    const sequelize = Product.sequelize;
    const transaction = await sequelize.transaction();
    try {
        const product = await Product.findByPk(id, {transaction});
        if(!product){
            await transaction.rollback();
            return res.status(404).json({success: false, message:'Product not found'});
        }

        await product.update({name, description, price, stock}, {transaction});
        await transaction.commit();
        return res.status(200).json({
            success: true,
            message: "Product updated successfully.",
            product,
          });
    } catch (error) {
        await transaction.rollback();
        console.log('error in updateProduct');
        next(error);
    }
};

exports.deleteProduct = async(req, res, next)=>{
    const {id} = req.params;
    const sequelize = Product.sequelize;
    const transaction =await sequelize.transaction();
    try {
        const product = await Product.findByPk(id, {transaction});
        if(!product){
            await transaction.rollback();
            return res.status(404).json({success: false, message: 'Product not found.'});
        }

        await product.destroy({transaction});
        await transaction.commit();
        return res.status(200).json({
            success: true,
            message:'Product deleted successfully.',
        });
    } catch (error) {
        await transaction.rollback();
        console.log('error in deleting product');
        next(error);
    }
};

exports.listProducts = async(req, res, next)=>{
    try {
        const products =await Product.findAll();
        return res.status(200).json({
        success: true,
        message:'Product list done',
        products});
    } catch (error) {
        console.log('Error fetching product list', error);
        next(error);
    }
};