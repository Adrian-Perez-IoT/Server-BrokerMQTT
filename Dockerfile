# Mosca
#
# VERSION 2.5.2

# FROM mhart/alpine-node:6
FROM node:10-alpine
#MAINTAINER Matteo Collina <hello@matteocollina.com>

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app/

# COPY ./ /usr/src/app/
COPY package*.json ./

#RUN apk update && \
#    apk add make gcc g++ python git zeromq-dev krb5-dev && \
#    npm install --unsafe-perm --production && \
#    apk del make gcc g++ python git
RUN npm install 
# RUN npm run build <-- no estaba comentado

# EXPOSE no publica el puerto, sino que actúa como una manera de documentar qué puertos del contenedor se publicarán en el tiempo de ejecución.
EXPOSE 80
# EXPOSE 1883 ¿Quien usa este puerto 1883? Lo deshabilito por las dudas es el motivo de que mi contenedor se detenga

#ENTRYPOINT ["/usr/src/app/bin/mosca", "-d", "/db", "--http-port", "80", "--http-bundle", "-v"]
#https://riptutorial.com/es/docker/example/2700/diferencia-entre-entrypoint-y-cmd 
# CMD ["node","dist/broker.js"]
# CMD ["node","src/broker.js"]
CMD ["node", "src/broker.js"]