
FROM node:lts-alpine AS development

WORKDIR /usr/src/app

COPY package.json ./

RUN yarn

COPY . .

RUN . .

FROM node:lts-alpine AS build

WORKDIR /usr/src/app

COPY package.json ./

COPY --from=development /usr/src/app/node_modules ./node_modules

COPY . .

RUN yarn build device-subgraph

ENV NODE_ENV production

RUN yarn install --frozen-lockfile --production && yarn cache clean

USER node


###################
# PRODUCTION
###################
FROM node:lts-alpine AS production

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist/apps/device-subgraph ./dist

CMD [ "node", "dist/main.js" ]

EXPOSE 3001
