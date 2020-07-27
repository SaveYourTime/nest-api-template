# Build
FROM node:12

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .
RUN yarn

COPY . .
RUN yarn build

# Run
FROM node:12-alpine

WORKDIR /usr/src/app

COPY --from=0 /usr/src/app .

EXPOSE 80

CMD ["yarn", "start:prod"]