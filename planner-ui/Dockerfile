# Etap budowania
FROM node:20-alpine as builder

WORKDIR /app

# Kopiujemy pliki package*.json
COPY package*.json ./

# Instalujemy zależności
RUN npm ci

# Kopiujemy resztę plików
COPY . .

# Budujemy aplikację
RUN npm run build

# Etap produkcyjny
FROM nginx:alpine

# Kopiujemy skonfigurowany nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Kopiujemy zbudowaną aplikację
COPY --from=builder /app/dist /usr/share/nginx/html

# Eksponujemy port 80
EXPOSE 80

# Uruchamiamy nginx
CMD ["nginx", "-g", "daemon off;"] 