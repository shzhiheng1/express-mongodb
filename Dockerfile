FROM node:16.0.0
WORKDIR /usr/src/app
COPY package*.json ./
# RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm","start"]