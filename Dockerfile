# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

RUN npm install

# excecuter for typescript
RUN npm i -g ts-node 

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port the app runs on
EXPOSE 4000

# Define the command to run the app
CMD ["npm", "start"]

# CMD ["node --es-module-specifier-resolution=node .\build\app.js"]