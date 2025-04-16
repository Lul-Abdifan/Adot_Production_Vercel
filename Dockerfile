# Stage 1: Build
FROM node:18-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Run
FROM node:18-slim
WORKDIR /app
COPY --from=builder /app ./
RUN npm ci --only=production
EXPOSE 3000
CMD ["node", "--max-old-space-size=1024", "node_modules/.bin/next", "start"]