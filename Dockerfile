FROM node:22

WORKDIR /smart-search

COPY package*.json ./

RUN npm install

COPY . .

CMD npm start