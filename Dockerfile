# Etapa 1: Build de la aplicación Angular
FROM node:18-alpine AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración de dependencias
COPY package*.json ./

# Instalar TODAS las dependencias (incluyendo devDependencies para el build)
RUN npm ci

# Copiar código fuente
COPY . .

# Compilar la aplicación para producción
RUN npx ng build --configuration=production

# Etapa 2: Servir con Nginx
FROM nginx:alpine AS production

# Remover configuración por defecto de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar archivos compilados desde la etapa anterior
COPY --from=builder /app/dist/task-manager-angular /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer puerto 8080 (requerido por OpenShift)
EXPOSE 8080

# Crear usuario no-root para OpenShift (usar usuario existente)
RUN mkdir -p /var/cache/nginx/client_temp && \
    mkdir -p /var/cache/nginx/proxy_temp && \
    mkdir -p /var/cache/nginx/fastcgi_temp && \
    mkdir -p /var/cache/nginx/uwsgi_temp && \
    mkdir -p /var/cache/nginx/scgi_temp && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /var/cache/nginx && \
    chmod -R 755 /var/log/nginx

# Cambiar a usuario no-root
USER nginx

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]