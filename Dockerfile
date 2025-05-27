# Etapa 1: Build de la aplicación Angular
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx ng build --configuration=production

# Etapa 2: Servir con Nginx compatible OpenShift
FROM nginxinc/nginx-unprivileged:alpine

# Copiar archivos compilados
COPY --from=builder /app/dist/task-manager-angular /usr/share/nginx/html

# Copiar configuración de Nginx simplificada
COPY nginx-openshift.conf /etc/nginx/conf.d/default.conf

# Usar puerto no privilegiado
EXPOSE 8080

# Usuario ya configurado en imagen unprivileged
CMD ["nginx", "-g", "daemon off;"]