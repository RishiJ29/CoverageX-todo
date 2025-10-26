# Stage 1: Build Angular app
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build -- --configuration production

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY default.conf /etc/nginx/conf.d/default.conf

# Copy the Angular build output to Nginx html folder
# The Angular project produces a `browser/` folder when using SSR/prerender.
# Copy the browser build output (static files) into nginx html root so
# the application's index.html replaces the default nginx welcome page.
COPY --from=build /app/dist/todo-app/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
