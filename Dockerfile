FROM node:alpine
WORKDIR /var/app/cache

COPY package.json .

RUN npm install
COPY . . 

CMD ["node", "index.js"]
