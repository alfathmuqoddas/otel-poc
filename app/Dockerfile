FROM node:24-slim
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN ls -l ./instrumentation.js 
EXPOSE 8080
CMD ["node", "server.js"]