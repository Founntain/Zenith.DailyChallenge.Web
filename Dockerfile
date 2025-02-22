# Use the official Node.js image as the base
FROM node:18-alpine

# Install http server
RUN npm install -g http-server

# Set the working directory
WORKDIR /app

# Copy the rest of the application files
COPY . .

# Expose the port `http-server` will run on
EXPOSE 8080

# Start the `http-server`
CMD ["http-server", ""]