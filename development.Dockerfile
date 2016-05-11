FROM node:argon
MAINTAINER Guido Vilariño <guido@democracyos.org>

RUN apt-get update && apt-get install -y libkrb5-dev

COPY package.json /usr/src/

WORKDIR /usr/src

RUN npm install --quiet --unsafe-perm

ENV NODE_ENV=docker

CMD ["./node_modules/.bin/gulp", "bws"]
