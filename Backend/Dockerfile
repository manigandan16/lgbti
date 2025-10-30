# Use Node official image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the app
COPY . .

# Expose the port (if your app runs on 9002)
EXPOSE 9003

# Run the app
CMD ["npm", "start"]
