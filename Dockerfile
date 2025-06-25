# Use Node.js as the base image
FROM node:22.14.0

# Set the working directory inside the container
WORKDIR /app

# Copy only necessary files for installing dependencies
COPY package.json pnpm-lock.yaml ./

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 8080

# Default command for development (can be overridden by docker-compose)
CMD ["pnpm", "run", "dev"]
