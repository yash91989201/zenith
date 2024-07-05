# Dockerfile
FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json ./
RUN bun install

# Copy project files
COPY . .

# Expose the Next.js port
EXPOSE 3000

# Start the Next.js development server
CMD ["bun", "run", "dev"]
