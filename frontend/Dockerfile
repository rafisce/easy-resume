FROM node:17-alpine3.15

COPY . /app

WORKDIR /app

COPY package.json .

RUN npm install

CMD ["npm","start"]
