# --------------> The build image
FROM node:latest AS build
WORKDIR /usr/src/app
COPY package*.json /usr/src/app/
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --omit=dev
 
# --------------> The production image
FROM node:lts-alpine
RUN apk add dumb-init
ENV NODE_ENV production
WORKDIR /usr/src/app
USER node
COPY --chown=node:node --from=build /usr/src/app/dist /usr/src/app/dist
COPY --chown=node:node --from=build /usr/src/app/node_modules /usr/src/app/node_modules
CMD ["dumb-init", "node", "dist/main.js"]

# build command to build the image
# docker build . -t actions-server

# credits
# https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/\
