FROM node:13.13.0-alpine3.10

# add bash
RUN apk update
RUN apk upgrade
RUN apk add bash

WORKDIR /usr/src/app

COPY package.json ./

# RUN  yarn cache clean --force && yarn install
RUN  npm cache clean --force && npm install

#COPY yarn.lock ./
COPY package-lock.json ./

#RUN yarn install
RUN npm install

#RUN yarn global add pm2
RUN npm install pm2 -g

COPY . .

EXPOSE 9000

CMD ["pm2-docker", "start", "app.json"]

# CMD ["npm", "run", "dev"]
