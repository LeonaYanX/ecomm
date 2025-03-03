const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3333'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Accept'
  ], 
  credentials: true, 
};

module.exports = corsOptions;
