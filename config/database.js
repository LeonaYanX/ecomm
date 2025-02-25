const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('ecomm', 'postgress', '3333', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false, 
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to PostgreSQL!');
  } catch (error) {
    console.error('Connection error:', error);
  }
};

testConnection();

module.exports = sequelize;
