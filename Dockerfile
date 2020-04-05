FROM node:13.11.0

WORKDIR /

ENV PATH ./node_modules/.bin:$PATH

RUN npm install
RUN cd client && npm install && cd ..

CMD ["npm", "start"]