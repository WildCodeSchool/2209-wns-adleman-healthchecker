FROM node:18.13-alpine

RUN apk --no-cache add curl

RUN mkdir /app
WORKDIR /app
COPY package*.json ./
COPY .npmrc .npmrc

RUN npm i -g pnpm
RUN npx playwright install
RUN pnpm i

COPY tsconfig.json tsconfig.json
COPY public public
COPY codegen.yml codegen.yml
COPY src src
COPY .env .env

CMD pnpm dev