FROM node:14
RUN mkdir -p /usr/src/server
WORKDIR /usr/src/server
COPY /backend/package.json /usr/src/server
RUN npm install
COPY ./backend /usr/src/server
EXPOSE 8081
CMD [ "npm", "start" ]