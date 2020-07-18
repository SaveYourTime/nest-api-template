# Build
FROM node:12 AS builder

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .
RUN yarn

COPY . .
RUN yarn build

# Run
FROM node:12-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app .

CMD ["yarn", "start:prod"]