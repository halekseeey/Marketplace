FROM node:21

WORKDIR /app

COPY ./ /app


RUN echo @groups:registry=https://git.miem.hse.ru/api/v4/projects/14230/packages/npm/ >> .npmrc
RUN npm config set -- //git.miem.hse.ru/:_authToken=Ha_DnTXyK2qLAqUvFWxz
RUN npm i @groups/uilib

RUN npm install

RUN npm run build

CMD npm run start

