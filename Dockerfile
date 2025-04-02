FROM node:22-alpine AS build

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json và package-lock.json vào container
COPY package.json package-lock.json ./

# Cài đặt dependencies
RUN npm install --legacy-peer-deps

# Sao chép toàn bộ source code vào container
COPY . .

# Build ứng dụng
RUN npm run build

# Sử dụng Nginx để phục vụ ứng dụng React
FROM nginx:alpine

# Sao chép file build từ giai đoạn trước vào Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 để truy cập ứng dụng
EXPOSE 80

# Khởi động Nginx
CMD ["nginx", "-g", "daemon off;"]
