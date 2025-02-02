const { Translate } = require('@google-cloud/translate').v2;
const cacheService = require('./cache.service');

class TranslationService {
  constructor() {
    this.translate = new Translate({
      projectId: process.env.GOOGLE_API_KEY
    });
  }

  async translate(content, targetLang) {
    const cacheKey = `translation:${JSON.stringify(content)}:${targetLang}`;
    
    // Check cache first
    const cachedTranslation = await cacheService.get(cacheKey);
    if (cachedTranslation) return cachedTranslation;

    try {
      const [translatedQuestion] = await this.translate.translate(
        content.question, 
        { to: targetLang }
      );
      
      const [translatedAnswer] = await this.translate.translate(
        content.answer, 
        { to: targetLang }
      );

      const translation = {
        question: translatedQuestion,
        answer: translatedAnswer
      };

      // Cache the translation
      await cacheService.set(cacheKey, translation, 24 * 60 * 60);

      return translation;
    } catch (error) {
      console.error('Translation error:', error);
      return content;
    }
  }
}

module.exports = new TranslationService();