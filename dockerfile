FROM node:9.9-alpine

WORKDIR /app
COPY . /app

RUN npm install npm@latest -g
RUN rm -rf /usr/local/lib/node_modules/npm
RUN mv node_modules/npm /usr/local/lib/node_modules/npm

RUN npm install
RUN npm run build

ENV HOST 0.0.0.0
EXPOSE 3000
CMD ["npm", "run", "start"]