const sequelize = require('./config/database');
const User = require('./models/User');
const Product = require('./models/Product');
const Payment = require('./models/Payment');
const OrderItem = require('./models/OrderItem');
const Order = require('./models/Order');
const Cart = require('./models/Cart');

const sync = async () => {
  try {
    await sequelize.sync({ force: true }); // recreating the tables
    console.log('Tables sincronized');
  } catch (error) {
    console.error('Error sincronizing', error);
  }
};

sync();
