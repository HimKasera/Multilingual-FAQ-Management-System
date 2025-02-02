const mongoose = require('mongoose');
const translationService = require('../services/translation.service');

const FAQSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true
  },
  translations: {
    type: Map,
    of: {
      question: String,
      answer: String
    },
    default: {}
  },
  languages: {
    type: [String],
    default: ['en']
  }
}, { timestamps: true });

// Method to get translated content
FAQSchema.methods.getTranslatedContent = async function(lang = 'en') {
  if (this.translations.has(lang)) {
    return this.translations.get(lang);
  }

  // Auto-translate if translation doesn't exist
  try {
    const translation = await translationService.translate({
      question: this.question,
      answer: this.answer
    }, lang);

    this.translations.set(lang, translation);
    await this.save();

    return translation;
  } catch (error) {
    // Fallback to English
    return {
      question: this.question,
      answer: this.answer
    };
  }
};

module.exports = mongoose.model('FAQ', FAQSchema);