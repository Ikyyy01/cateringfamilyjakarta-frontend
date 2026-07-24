# Gunakan base image node untuk environment
FROM node:20-alpine as build-stage

# Set working directory di dalam container
WORKDIR /app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install dependensi
RUN npm install

# Copy seluruh source code
COPY . .

# Build aplikasi Vue
RUN npm run build

# Gunakan base image nginx untuk production
FROM nginx:alpine as production-stage

# Copy hasil build dari stage sebelumnya ke nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Jalankan nginx di background
CMD ["nginx", "-g", "daemon off;"]
