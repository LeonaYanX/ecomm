const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'E-Commerce API',
        description: 'API documentation for the eCommerce project',
        version: '1.0.0',
    },
    servers: [{ url: "http://localhost:3333" }] ,
    host: 'localhost:3333', 
    schemes: ['http'], 
    basePath: '/',
    consumes: ['application/json'],
    produces: ['application/json'],
   
};

const outputFile = './config/swagger-output.json'; 
const routes = [
    '../routes/authRoutes.js', 
    '../routes/orderRoutes.js',
    '../routes/paymentRoutes.js',
    '../routes/productRoutes.js',
]; 

swaggerAutogen(outputFile, routes, doc).then(() => {
    console.log('Swagger JSON generated successfully');
});
