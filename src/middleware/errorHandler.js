const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: err.message,
        details: Object.values(err.errors).map(e => e.message)
      });
    }
  
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
  
    res.status(err.status || 500).json({
      error: err.message || 'Internal server error'
    });
  };
  
  module.exports = errorHandler;