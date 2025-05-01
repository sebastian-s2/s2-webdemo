FROM node:18-alpine

RUN apk add --no-cache iputils

WORKDIR /app

COPY backend/package.json .
RUN npm install

COPY backend/src ./src
COPY frontend/public ./frontend/public

EXPOSE 8080
CMD ["node", "src/server.js"] 