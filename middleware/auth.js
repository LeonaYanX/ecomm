const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const RefreshToken = require('../models/RefreshToken');
const generateTokens = require('../utils/token');

const verifyToken = (res,req,next)=>{
    const token = req.headers['authorization']?.split(' ')[1]; 
     
    if(!token){
        res.status(403).json({ error: 'Token is required' });
    }

    try{
        const decoded = jwt.verify(token, jwtConfig.secretKey);

        req.user = decoded;
        next();
    }catch(error){
        res.status(401).json({error: 'Invalid token'});
    }

};

const refreshToken = async (refreshT)=>{
  try{
    const storedToken = await RefreshToken.findOne({token: refreshT});

    if(!storedToken || storedToken.expiresAt< Date.now())
        {
            throw new Error('Refresh Token is invalid or expired');
        }
    return generateTokens(storedToken.userId);    
    } catch(error){
        console.log('Error in refreshToken auth middleware');
        throw new Error('Failed to refresh token: User not found or token invalid');
    }
};

module.exports = {refreshToken, verifyToken};