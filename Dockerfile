FROM node:8.9.2

RUN apt-get update -qy && apt-get install -qy pdftk
ARG NODE_ENV=development
ARG GITSHA=undefined
ENV NODE_ENV=${NODE_ENV} GITSHA=${GITSHA} SENTRY_RELEASE=${GITSHA}
RUN mkdir /app
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm install
COPY . /app
RUN node_modules/.bin/eslint .
CMD ["node", "/app/app.js"]
EXPOSE 9000
