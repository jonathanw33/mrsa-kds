FROM node:16-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# For development mode, just use the development server
EXPOSE 3000

# Command to run the dev server
CMD ["npm", "start"]
