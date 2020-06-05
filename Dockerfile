FROM node:12.17.0

WORKDIR /usr/src/nodejs

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

VOLUME ./:/usr/src/nodejs

CMD ["npm","start"]