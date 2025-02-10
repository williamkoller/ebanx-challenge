FROM node:20.11.1-alpine

WORKDIR /app

RUN mkdir -p /app

COPY package.json /app

RUN rm -rf node_modules \
    && npm install

COPY . /app

EXPOSE 3001