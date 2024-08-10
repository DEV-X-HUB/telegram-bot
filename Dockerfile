# Use the official Node.js 20 image as the base image
FROM node:20-alpine

# Set the working directory
WORKDIR /bae-bot
ARG NODE_ENV=postgresql://tg-bot_owner:************@ep-still-paper-a56afpeg-pooler.us-east-2.aws.neon.tech/tg-bot?sslmode=require

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy the prisma directory
COPY prisma ./prisma


# Copy the rest of the application code
COPY . .

RUN npm install

# Build the application
# RUN npx prisma generate

# RUN npx prisma db push 

RUN npm run build


# Expose the application port (if it needs to communicate over HTTP, otherwise omit)
EXPOSE 8080

# Start the application
CMD ["npm", "run", "start"] 
