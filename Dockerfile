FROM node:18
WORKDIR /usr/src/app

ARG TZ=Europe/Berlin

COPY . /usr/src/app

CMD ["node", "build/index.js"]