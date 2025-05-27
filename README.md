# Task Manager Angular 📋

Una aplicación moderna de gestión de tareas desarrollada con Angular 15, que permite crear, editar, eliminar y organizar tareas con diferentes prioridades y estados de progreso.

## 🚀 Características

- ✅ **CRUD completo** de tareas (Crear, Leer, Actualizar, Eliminar)
- 🎨 **Interfaz moderna** con Angular Material
- 📱 **Responsive design** optimizado para móviles y desktop
- 💾 **Persistencia local** con localStorage
- ⚡ **Formularios reactivos** con validaciones en tiempo real
- 🔍 **Filtros** por prioridad y estado
- ⚠️ **Confirmaciones** para acciones destructivas
- 🎯 **Modal inteligente** que detecta cambios en edición

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Angular 15** - Framework principal
- **Angular Material** - Componentes UI y theming
- **TypeScript** - Lenguaje de programación
- **SCSS** - Preprocesador CSS
- **RxJS** - Programación reactiva
- **Angular Reactive Forms** - Manejo de formularios

### Desarrollo
- **Angular CLI** - Herramientas de desarrollo
- **Node.js 18** - Runtime para desarrollo
- **npm** - Gestor de paquetes

### Producción y Despliegue
- **Docker** - Containerización
- **Nginx Alpine** - Servidor web para producción
- **OpenShift** - Plataforma de contenedores
- **Multi-stage Docker build** - Optimización de imagen

### Arquitectura
- **Componentes modulares** - Estructura escalable
- **Services e Interfaces** - Separación de responsabilidades
- **Enums** - Tipado fuerte para constantes

## 📋 Prerrequisitos

### Para Desarrollo Local
- Node.js 18 o superior
- npm 8 o superior
- Angular CLI 15

### Para Despliegue
- Docker
- OpenShift CLI (oc)
- Acceso a cluster OpenShift

## 🏃‍♂️ Ejecutar Localmente

### 1. Descomprimir archivo y entrar por consola a la ubicación
```bash
cd task-manager-angular
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Ejecutar en modo desarrollo
```bash
ng serve
```

La aplicación estará disponible en `http://localhost:4200`

## 🔧 Configuración de Desarrollo

### Angular CLI
```bash
# Instalar Angular CLI globalmente
npm install -g @angular/cli@15

# Verificar instalación
ng version
```

## 🐳 Despliegue con Docker

### Desarrollo Local con Docker

```bash
# Construir imagen
docker build -t task-manager-angular .

# Ejecutar contenedor
docker run -p 8080:8080 task-manager-angular

# Acceder a la aplicación
open http://localhost:8080
```

## ☁️ Despliegue en OpenShift

### Opción 1: Script Automatizado

```bash
# Hacer script ejecutable
chmod +x build-docker.sh

# Login a OpenShift
oc login https://your-openshift-cluster-url

# Ejecutar deploy automatizado
./build-docker.sh
```

### Opción 2: Despliegue Manual

#### 1. Preparar OpenShift
```bash
# Login al cluster
oc login https://your-openshift-cluster-url

# Crear proyecto
oc new-project task-manager --display-name="Task Manager Angular"

# Verificar proyecto
oc project task-manager
```

#### 2. Construir y subir imagen
```bash
# Construir imagen Docker
docker build -t task-manager-angular:latest .

# Login al registry de OpenShift
docker login -u $(oc whoami) -p $(oc whoami -t) image-registry.openshift-image-stream.local

# Crear ImageStream
oc create imagestream task-manager-angular

# Tag y push
docker tag task-manager-angular:latest image-registry.openshift-image-stream.local/task-manager/task-manager-angular:latest
docker push image-registry.openshift-image-stream.local/task-manager/task-manager-angular:latest
```

#### 3. Desplegar aplicación
```bash
# Aplicar manifiestos
oc apply -f openshift/

# Verificar deployment
oc rollout status deployment/task-manager-angular

# Obtener URL
oc get route task-manager-angular -o jsonpath='{.spec.host}'
```

### Verificar Despliegue

```bash
# Ver todos los recursos
oc get all

# Ver logs
oc logs deployment/task-manager-angular

# Ver estado de pods
oc get pods

# Health check
curl https://your-app-url/health
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── components/          # Componentes reutilizables
│   │   ├── table/          # Componente tabla de tareas
│   │   ├── task-modal/     # Modal para crear/editar tareas
│   │   ├── confirmation-modal/ # Modal de confirmación
│   │   └── shared.module.ts # Módulo compartido
│   ├── core/               # Servicios y funcionalidades core
│   │   ├── service/        # Servicios de negocio
│   │   └── enum/           # Enumeraciones
│   ├── interface/          # Interfaces TypeScript
│   ├── pages/              # Páginas de la aplicación
│   │   └── home/          # Página principal
│   ├── app-routing.module.ts # Configuración de rutas
│   ├── app.component.*     # Componente raíz
│   └── app.module.ts       # Módulo principal
├── assets/                 # Recursos estáticos
├── environments/           # Configuraciones de entorno
└── styles.css             # Estilos globales
```

## 🧪 Testing

### Unit Tests
```bash
# Ejecutar tests una vez
npm test

# Ejecutar tests en modo watch
ng test

# Coverage report
ng test --code-coverage
```

## 🔍 Funcionalidades Principales

### Gestión de Tareas
- **Crear**: Modal con formulario reactivo y validaciones
- **Listar**: Tabla con paginación y filtros
- **Editar**: Modal pre-poblado con detección de cambios
- **Eliminar**: Confirmación con modal de advertencia

### Interfaz de Usuario
- **Material Design**: Componentes consistentes y modernos
- **Themes**: Paleta de colores personalizada
- **Animaciones**: Transiciones suaves y feedback visual

### Validaciones
- **Formularios reactivos**: Validación en tiempo real
- **Mensajes de error**: Contextuales y descriptivos
- **Restricciones de fecha**: No permitir fechas pasadas
- **Longitud de campos**: Límites mínimos y máximos

## 🚨 Troubleshooting

### Problemas Comunes de Desarrollo

**Error: Node version incompatible**
```bash
# Verificar versión de Node
node --version

# Instalar Node 18+ si es necesario
nvm install 18
nvm use 18
```

**Error: Angular CLI not found**
```bash
# Instalar Angular CLI globalmente
npm install -g @angular/cli@15

# Verificar instalación
ng version
```

**Error: Port 4200 already in use**
```bash
# Usar puerto diferente
ng serve --port 4201

# O matar proceso en puerto 4200
kill -9 $(lsof -ti:4200)
```

### Problemas de Despliegue

**Docker build fails**
```bash
# Limpiar cache de Docker
docker system prune -a

# Rebuild sin cache
docker build --no-cache -t task-manager-angular .
```

**OpenShift deployment fails**
```bash
# Verificar logs
oc logs deployment/task-manager-angular

# Verificar eventos
oc get events --sort-by=.metadata.creationTimestamp

# Describir pod para más detalles
oc describe pod <pod-name>
```

## 📞 Contacto

Fabian Araneda - fabian.aranedam@hotmail.com
