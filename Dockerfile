FROM node:10

WORKDIR /usr/src

COPY package*.json ./
RUN npm install 
COPY . .

RUN git clone https://github.com/vishnubob/wait-for-it.git

EXPOSE 4000


CMD [ "npm", "start" ]