const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const  User = require('./User');
const { expiresIn } = require('../config/jwt');
const moment = require('moment');

const RefreshToken = sequelize.define('RefreshToken',{
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
    token:{
       type: DataTypes.STRING,
       allowNull: false, 
    },
    userId:{
        type: DataTypes.UUID,
        allowNull: false,
        references:{
            model:User,
            key: 'id',
        },
    },
    expiresAt:{
        type: DataTypes.DATE,
        allowNull: false,
    },

},{timestamps:false});

User.hasMany(RefreshToken, { foreignKey: 'userId' });
RefreshToken.belongsTo(User, {foreignKey: 'userId'});

RefreshToken.beforeCreate((token, options)=>{
    token.expiresAt = moment().add(expiresIn).toDate();
});

module.exports = RefreshToken;