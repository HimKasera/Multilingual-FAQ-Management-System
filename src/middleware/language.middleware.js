const SUPPORTED_LANGUAGES = ['en', 'hi', 'bn'];

const languageMiddleware = (req, res, next) => {
  const lang = req.query.lang || 'en';
  
  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    return res.status(400).json({
      error: `Language not supported. Supported languages: ${SUPPORTED_LANGUAGES.join(', ')}`
    });
  }

  req.language = lang;
  next();
};

module.exports = languageMiddleware;