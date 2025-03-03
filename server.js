require('dotenv').config();
const cors = require('cors');
const express = require('express');
const sequelize = require('./config/database');
const corsOptions = require('./config/cors');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const productRoutes = require('./routes/productRoutes');
const errorHandler = require('./middleware/errorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger-output.json');
const app = express();


// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions)); // using CORS

// Routes
app.use('/', authRoutes);
app.use('/product', productRoutes);
app.use('/order', orderRoutes);
app.use('/payment', paymentRoutes);

const swaggerUiOptions = {
  customSiteTitle: "API Documentation",
  customfavIcon: "/favicon.ico",
  swaggerOptions: {
    supportedSubmitMethods: ['get', 'post', 'put', 'delete'],
    validatorUrl: null,
    displayRequestDuration: true,
    docExpansion: "none",
    withCredentials: true, 
  },
};

app.use('/api-docs', cors(corsOptions), swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerUiOptions));

console.log('Swagger UI available at http://localhost:3333/api-docs');
// Error handler
app.use(errorHandler);

// Starting server
const PORT = process.env.PORT || 3333;

const startServer = async () => {
  try {
    await sequelize.authenticate(); // Checking the connection to DB
    await sequelize.sync(); // Synchronizing the models
    console.log('Database connected successfully.');

    app.listen(PORT, () => {
      console.log(`Server started on port: ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1); // Exit the process if there's an error
  }
};

// Starting server
startServer();
