FROM node:18

WORKDIR /app

COPY server/package*.json ./
RUN npm install

COPY server ./server

WORKDIR /app/server

RUN mkdir -p /app/server/data

EXPOSE 3000

CMD ["node", "index.js"]
