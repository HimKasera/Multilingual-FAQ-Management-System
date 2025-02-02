// jest.setup.js
require('dotenv').config({ path: '.env.test' });

jest.setTimeout(10000);

process.env.JWT_SECRET = 'test-secret';
process.env.MONGODB_URI = process.env.MONGODB_TEST_URI;