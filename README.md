# Multilingual FAQ Management System

## Overview
A robust backend system for managing Frequently Asked Questions (FAQs) with multilingual support. The system includes an admin dashboard for content management, automatic translation capabilities, and a caching mechanism for improved performance.

## Features
- 🌐 Multilingual support with automatic translation
- 📝 WYSIWYG editor for content formatting
- 💾 Efficient caching using Redis
- 🔐 Secure admin authentication
- 🚀 RESTful API endpoints
- 📱 Responsive admin dashboard

## Technology Stack
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Cache**: Redis
- **Translation**: Google Translate API
- **Authentication**: JWT (JSON Web Tokens)
- **Editor**: TinyMCE

## Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Redis
- Google Cloud Account (for translation API)

## Installation

1. Clone the repository
```bash
https://github.com/HimKasera/Multilingual-FAQ-Management-System.git
cd multilingual-faq-backend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
MONGODB_URI=mongodb://localhost:27017/faq_db
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-jwt-secret
GOOGLE_PROJECT_ID=your-google-project-id
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
PORT=3000
```

4. Initialize the database
```bash
node src/db/init.js
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Access the admin dashboard at: `http://localhost:3000/admin`

## API Endpoints

### FAQ Endpoints

#### Get all FAQs
```bash
GET /api/faqs
```
Query Parameters:
- `lang`: Language code (e.g., 'en', 'hi', 'bn')

#### Create FAQ
```bash
POST /api/faqs
```
Request Body:
```json
{
  "question": "What is your service?",
  "answer": "Our service provides...",
  "languages": ["en", "hi", "bn"]
}
```

#### Update FAQ
```bash
PUT /api/faqs/:id
```

#### Delete FAQ
```bash
DELETE /api/faqs/:id
```

### Admin Endpoints

#### Login
```bash
POST /api/admin/login
```
Request Body:
```json
{
  "username": "admin",
  "password": "your-password"
}
```

## Project Structure
```
multilingual-faq-backend/
├── src/
│   ├── admin/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── utils/
│   ├── config/
│   ├── db/
│   ├── app.js
│   └── server.js
├── tests/
├── public/
├── .env
└── README.md
```

## Testing
Run the test suite:
```bash
npm test
```

## Docker Support
Build and run with Docker:
```bash
docker-compose up --build
```

## Cache Management
The system uses Redis for caching translations and frequently accessed data. Cache expiry is set to 24 hours by default.

## Translation Support
Currently supported languages:
- English (en)
- Hindi (hi)
- Bengali (bn)

To add more languages, modify the `SUPPORTED_LANGUAGES` array in `src/middleware/language.middleware.js`.

## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Create a Pull Request

## Error Handling
The system includes comprehensive error handling:
- Validation errors (400)
- Authentication errors (401)
- Not found errors (404)
- Server errors (500)

## Performance Optimization
- Redis caching for translations
- Database query optimization
- Response compression

## Security Features
- JWT authentication
- Input validation
- XSS protection
- Rate limiting

## Deployment
The application can be deployed to any Node.js hosting platform. Example using Heroku:
```bash
heroku create
git push heroku main
```


## Acknowledgments
- Google Translate API
- MongoDB Team
- Express.js Community
