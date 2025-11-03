FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY cube.js .
COPY model ./model

EXPOSE 4000

CMD ["npm", "start"]