const Joi = require('joi');

const faqSchema = Joi.object({
  question: Joi.string().required().min(10),
  answer: Joi.string().required().min(20),
  languages: Joi.array().items(
    Joi.string().valid('en', 'hi', 'bn')
  ).default(['en'])
});

module.exports = {
  validateFAQ: (data) => faqSchema.validate(data)
};