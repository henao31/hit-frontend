# React + Vite + Electron

Una aplicación de escritorio moderna construida con React, Vite y Electron.

## 🚀 Características

- ⚡ **Vite** - Herramienta de construcción ultra rápida
- ⚛️ **React 18** - Biblioteca de interfaz de usuario
- 🖥️ **Electron** - Aplicación de escritorio multiplataforma
- 🔷 **TypeScript** - Tipado estático para JavaScript
- 🎨 **CSS moderno** - Estilos con gradientes y efectos visuales
- 🔥 **Hot Reload** - Recarga automática durante el desarrollo

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone <tu-repositorio>
cd react-electron-vite
```

2. Instala las dependencias:
```bash
npm install
```

## 🛠️ Scripts disponibles

### Desarrollo
```bash
# Ejecutar en modo desarrollo (React + Electron)
npm run dev

# Solo React (Vite)
npm run dev:vite

# Solo Electron
npm run dev:electron
```

### Construcción
```bash
# Construir para producción
npm run build

# Construir solo React
npm run build:vite

# Construir solo Electron
npm run build:electron
```

### Distribución
```bash
# Crear ejecutables para distribución
npm run dist
```

## 🏗️ Estructura del proyecto

```
react-electron-vite/
├── electron/           # Código de Electron
│   ├── main.ts        # Proceso principal
│   ├── preload.ts     # Script de precarga
│   └── util.ts        # Utilidades
├── src/               # Código de React
│   ├── App.tsx        # Componente principal
│   ├── App.css        # Estilos del componente
│   ├── main.tsx       # Punto de entrada de React
│   └── index.css      # Estilos globales
├── public/            # Archivos estáticos
├── dist/              # Build de React (generado)
├── dist-electron/     # Build de Electron (generado)
└── dist-app/          # Ejecutables finales (generado)
```

## 🎯 Funcionalidades incluidas

- **Interfaz moderna** con gradientes y efectos visuales
- **Comunicación IPC** entre procesos de Electron y React
- **Apertura de ventanas** desde la aplicación principal
- **Contador interactivo** para demostrar React
- **Mensajes del proceso principal** mostrados en la UI

## 🔧 Configuración

### Vite
Configurado en `vite.config.ts` con:
- Plugin de React
- Puerto 5173 para desarrollo
- Base path relativo para Electron

### Electron
Configurado en `electron/main.ts` con:
- Ventana principal de 1200x800
- Aislamiento de contexto habilitado
- Preload script para comunicación segura

### TypeScript
Configurado con:
- `tsconfig.json` para React
- `electron/tsconfig.json` para Electron
- Tipos estrictos habilitados

## 📱 Plataformas soportadas

- ✅ Windows
- ✅ macOS  
- ✅ Linux

## 🚀 Próximos pasos

1. Personaliza la interfaz en `src/App.tsx`
2. Añade nuevas funcionalidades en `electron/main.ts`
3. Configura el empaquetado en `package.json` > `build`
4. Añade iconos personalizados en la carpeta `assets/`

## 📄 Licencia

MIT License - ver archivo LICENSE para más detalles.
