const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faq.controller');
const languageMiddleware = require('../middleware/language.middleware');
const { validateFAQ } = require('../utils/validation');

router.post('/', async (req, res, next) => {
  const { error } = validateFAQ(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
}, faqController.createFAQ.bind(faqController));

router.get('/', languageMiddleware, faqController.getFAQs);

router.get('/:id', languageMiddleware, faqController.getFAQById);

router.put('/:id', async (req, res, next) => {
  const { error } = validateFAQ(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
}, faqController.updateFAQ); 

router.delete('/:id', faqController.deleteFAQ);

module.exports = router;