# Giai đoạn 1: Build ứng dụng React
FROM node:22-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Giai đoạn 2: Dùng nginx để phục vụ ứng dụng
FROM nginx:alpine

# Copy build output vào nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copy cấu hình nginx tùy chỉnh
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 9090

CMD ["nginx", "-g", "daemon off;"]
