FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build -- --configuration production


# Use nginx to run the build app
FROM nginx:alpine

# remove Default nginx config
RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist/wm-planner/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

