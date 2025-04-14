FROM node:20-alpine as build
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install -g @angular/cli
RUN npm ci

COPY . .

RUN ng build --configuration=production

FROM nginx:alpine
COPY --from=build /app/dist/zenith.daily-challenge.web/browser /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/start.sh /start.sh

RUN chmod +x /start.sh

EXPOSE 80

CMD ["/start.sh"]
