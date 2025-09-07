import { app, BrowserWindow, Menu, shell, ipcMain } from 'electron'
import { join } from 'path'
import { isDev } from './util'

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
const isDevApp = process.env.NODE_ENV === 'development' || !app.isPackaged

// Configurar rutas correctas
const appPath = app.getAppPath()
process.env.DIST_ELECTRON = join(appPath, 'dist-electron')
process.env.DIST = join(appPath, 'dist')
process.env.VITE_PUBLIC = isDevApp
  ? join(appPath, 'public')
  : process.env.DIST

// Forzar la URL de desarrollo si estamos en modo desarrollo
if (isDevApp) {
  process.env.VITE_DEV_SERVER_URL = 'http://localhost:5173'
}

// Verificar si el servidor de Vite está disponible
const checkViteServer = async () => {
  try {
    const response = await fetch('http://localhost:5173')
    return response.ok
  } catch {
    return false
  }
}

// Disable GPU Acceleration for Windows 7
if (process.platform === 'win32') app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, './preload.js')
const url = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173'
const indexHtml = join(process.env.DIST, 'index.html')

console.log('isDev:', isDev)
console.log('appPath:', appPath)
console.log('DIST:', process.env.DIST)
console.log('VITE_DEV_SERVER_URL:', process.env.VITE_DEV_SERVER_URL)
console.log('url:', url)
console.log('indexHtml:', indexHtml)

async function createWindow() {
  win = new BrowserWindow({
    title: 'React Electron Vite App',
    icon: process.env.VITE_PUBLIC ? join(process.env.VITE_PUBLIC, 'favicon.ico') : undefined,
    width: 1200,
    height: 800,
    webPreferences: {
      preload,
      // Warning: Enabling this will expose the app to security vulnerabilities
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  // En modo desarrollo, siempre intentar cargar desde el servidor de Vite
  if (isDevApp) {
    console.log('Modo desarrollo - cargando desde servidor Vite:', url)
    // Esperar un poco para que el servidor de Vite esté listo
    await new Promise(resolve => setTimeout(resolve, 1000))
    try {
      await win.loadURL(url)
      win.webContents.openDevTools()
    } catch (error) {
      console.log('Error cargando desde servidor Vite, cargando archivo local:', error)
      await win.loadFile(indexHtml)
    }
  } else {
    console.log('Modo producción - cargando archivo HTML:', indexHtml)
    await win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
  // win.webContents.on('will-navigate', (event, url) => { }) #344
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})
