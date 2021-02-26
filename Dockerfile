FROM node:lts-alpine3.12

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

EXPOSE 8000

CMD ["npm", "run", "start:log"]
