# -----------------------------
# FRONTEND Dockerfile (Dev mode)
# -----------------------------
FROM node:22-alpine3.19

# Set working directory
WORKDIR /app

# Copy dependency files first (better cache)
COPY package*.json ./

RUN npm config set registry https://registry.npmmirror.com

RUN npm cache clean --force

# Install dependencies
RUN npm install

# Copy rest of the project
COPY . .

# Expose Next.js default port
EXPOSE 3000

# Run Next.js in dev mode
CMD ["npm", "run", "dev"]

