# Step 1: Build Angular App
FROM node:lts-slim AS build-stage

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install -g @angular/cli

RUN npm ci

COPY . .

RUN ng build --configuration=production

# Step 2: Serve with a lightweight HTTP server
FROM node:20 AS serve-stage
WORKDIR /app

COPY --from=build-stage /app/dist/zenith.daily-challenge.web/browser /app/dist

COPY start.sh /start.sh
RUN chmod +x /start.sh

RUN npm install -g http-server

EXPOSE 80

CMD ["/start.sh"]
