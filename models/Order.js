const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'shipping', 'delivered'),
    defaultValue: 'pending',
  },
  totalAmount:{
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false,
    defaultValue: 0,
  }
}, { timestamps: true });

Order.beforeCreate(async (order, options) => {
  try {
    const orderItems = await OrderItem.findAll({
      where: { orderId: order.id },
      include: [{ model: Product }],
      transaction: options.transaction,
    });

    const totalAmount = orderItems.reduce((sum, item) => {
      return sum + (item.quantity * item.Product.price);
    }, 0);

    order.totalAmount = totalAmount;
  } catch (error) {
    throw new Error('Error calculating total Amount');
  }
});

User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

module.exports = Order;
