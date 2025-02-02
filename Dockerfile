FROM node:16-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies and nodemon globally
RUN npm install && npm install -g nodemon

# Copy project files
COPY . .

# Expose port
EXPOSE 8000

# Start the application
CMD ["npm", "run", "dev"]