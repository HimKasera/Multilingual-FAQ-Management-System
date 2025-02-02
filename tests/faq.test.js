// tests/faq.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const FAQ = require('../src/models/faq.model');

describe('FAQ API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI);
  });

  afterEach(async () => {
    await FAQ.deleteMany();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/faqs', () => {
    it('should create a new FAQ', async () => {
      const res = await request(app)
        .post('/api/faqs')
        .send({
          question: 'Test question?',
          answer: 'Test answer with sufficient length',
          languages: ['en', 'hi']
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.question).toBe('Test question?');
    });
  });

  describe('GET /api/faqs', () => {
    it('should return FAQs in requested language', async () => {
      // Create test FAQ
      await FAQ.create({
        question: 'Test question?',
        answer: 'Test answer',
        languages: ['en', 'hi']
      });

      const res = await request(app)
        .get('/api/faqs?lang=hi');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });
  });
});