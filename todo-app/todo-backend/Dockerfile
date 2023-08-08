FROM node:16

WORKDIR /usr/src/app

COPY --chown=node:node . .
ENV NODE_ENV production

RUN npm ci --only=production

USER node
CMD npm start



