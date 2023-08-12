FROM node:lts-alpine3.17 as node
WORKDIR /usr/src/app

ARG TZ=Europe/Berlin

COPY . /usr/src/app

CMD ["node", "server/index.js"]