const User = require('../models/User');
const generateTokens = require('../utils/token');
const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');
exports.register = async (req,resizeBy,next)=>{
 const {username, email, password, role} = req.body;
 const sequelize = User.sequelize;
 const transaction =await sequelize.transaction();

 try {
    const errors = validationResult(req);

    if (!errors.isEmpty()){
        await transaction.rollback();
        return res.status(400).json({success: false , errors: errors.array()});
    }

    const existingUser = await User.findOne({where:{email}, transaction: transaction});

    if(existingUser){
        await transaction.rollback();
        return resizeBy.status(400).json({success: false , message: 'User already exists'});
    }

    const passwordHashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        username, email,
        password: passwordHashed,
        role
    },{transaction:transaction});

    await transaction.commit();
    return resizeBy.status(201).json({
        success: true,
        message: 'User created succesfully.',
        user: {username, email, role}
    });
 } catch (error) {
    await transaction.rollback();
    console.log('Error registring new user');
    next(error);
 }
};
exports.login = async(req, res, next)=>{
    const {email,password} = req.body;
    try {
        const user =await User.findOne({where:{email}});
        if(!user){
            return res.status(401).json({success: false , message:'Wrong credentials!'});
        }
       
        const compare = await bcrypt.compare(password,user.password);

        if(!compare){
            return res.status(401).json({success: false , message:'Wrong credentials!'});
        }

        const tokens = generateTokens(user.id);
        return res.status(200).json({success: true, message:'Login successful',
            tokens,
            user:{username: user.username, email:user.email, role: user.role}
        });
    } catch (error) {
        console.log('Error in login');
        next(error);
    }
};
