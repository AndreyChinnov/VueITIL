FROM node:16.20.2

# устанавливаем простой HTTP-сервер для статики
RUN npm install -g http-server

RUN mkdir -p /var/www/vueitil
WORKDIR /var/www/vueitil

COPY . /var/www/vueitil
RUN npm install
RUN npm run build
EXPOSE 8080
CMD [ "http-server", "dist" ]