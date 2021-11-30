# Stage 0, based on Node.js, to build and compile Angular
FROM node:16.10-alpine as node
WORKDIR /app
RUN mkdir /app/dist
COPY package.json /app/
COPY package-lock.json /app/
RUN npm install
COPY ./ /app/

RUN npm run build:prod

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.13-alpine
COPY --from=node /app/dist/ /usr/share/nginx/html
COPY docker/nginx/entrypoint-ui.sh /entrypoint.sh
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
ENTRYPOINT [ "/entrypoint.sh" ]
