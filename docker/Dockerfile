FROM node:lts

RUN apt-get update

RUN apt-get install -y nano git curl

WORKDIR /

RUN git clone https://github.com/humlab/excel-translator-server

WORKDIR /excel-translator-server

RUN npm install

CMD ["node", "/excel-translator-server/src/main.js"]