FROM node:alpine
WORKDIR /var/app/micro

COPY package.json .

RUN npm install
COPY . . 

EXPOSE 4000
CMD ["node", "index.js"]
