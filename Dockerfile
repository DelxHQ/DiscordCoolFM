FROM node:10.16.0-alpine

RUN apk add --no-cache \
  build-base \
  g++ \
  python \
  ffmpeg


WORKDIR /bot
COPY . /bot

VOLUME ["/bot"]

RUN npm i

CMD [ "npm", "start" ]