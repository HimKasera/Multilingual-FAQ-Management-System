const FAQ = require('../models/faq.model');

class FAQController {
  async createFAQ(req, res) {
    try {
      const { question, answer, languages } = req.body;
      
      const faq = new FAQ({
        question,
        answer,
        languages: languages || ['en']
      });
      
      // Auto-translate for specified languages
      for (let lang of faq.languages) {
        if (lang !== 'en') {
          await faq.getTranslatedContent(lang);
        }
      }
      await faq.save();
      res.status(201).json(faq);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getFAQById(req, res) {
    try {
      const { id } = req.params;
      const { language } = req; // From languageMiddleware

      const faq = await FAQ.findById(id);
      
      if (!faq) {
        return res.status(404).json({ error: 'FAQ not found' });
      }

      // Get translated content if requested language is different from default
      if (language !== 'en') {
        const translatedContent = await faq.getTranslatedContent(language);
        return res.json({
          ...faq.toObject(),
          ...translatedContent
        });
      }

      res.json(faq);
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid FAQ ID' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async getFAQs(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const { language } = req; // From languageMiddleware
      
      const skip = (page - 1) * limit;
      const faqs = await FAQ.find()
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 });

      const total = await FAQ.countDocuments();
      
      const translatedFAQs = await Promise.all(
        faqs.map(async (faq) => {
          const translatedContent = await faq.getTranslatedContent(language);
          return {
            ...faq.toObject(),
            ...translatedContent
          };
        })
      );

      res.json({
        faqs: translatedFAQs,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateFAQ(req, res) {
    try {
      const { id } = req.params;
      const { question, answer, languages } = req.body;

      const faq = await FAQ.findById(id);
      
      if (!faq) {
        return res.status(404).json({ error: 'FAQ not found' });
      }

      // Update the FAQ fields
      faq.question = question;
      faq.answer = answer;
      faq.languages = languages || ['en'];

      // Re-generate translations for all supported languages
      for (let lang of faq.languages) {
        if (lang !== 'en') {
          await faq.getTranslatedContent(lang);
        }
      }

      await faq.save();
      res.json(faq);
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid FAQ ID' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async deleteFAQ(req, res) {
    try {
      const { id } = req.params;
      
      const faq = await FAQ.findById(id);
      
      if (!faq) {
        return res.status(404).json({ error: 'FAQ not found' });
      }

      await FAQ.findByIdAndDelete(id);
      res.status(204).send();
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid FAQ ID' });
      }
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new FAQController();