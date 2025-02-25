const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const RefreshToken = require('../models/RefreshToken');


const generateToken = (payload , expiresIn='1h')=>{
    return jwt.sign(payload, jwtConfig.secretKey, {expiresIn});
};

const generateTokens = async (userId)=>{
    try{
        const payload = userId;

        const accessToken = generateToken(payload, '15m');

        const refreshToken = jwt.sign({}, jwtConfig.secretKey, {expiresIn: '7d'});

        await RefreshToken.create({
            token: refreshToken,
            userId,
            expiresAt: new Date(Date.now() + 7*24*60*60*1000),
        });

        return {refreshToken, accessToken};
    } catch(error){
        console.error('Error generating tokens:', error);
        throw new Error('Token generation failed');
    }
};

module.exports = {generateToken, generateTokens}