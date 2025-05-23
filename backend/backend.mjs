/* global Bare, BareKit */

// Importaciones necesarias para el funcionamiento del backend
import RPC from 'bare-rpc'  // Para comunicación entre procesos
import fs from 'bare-fs'    // Para operaciones de sistema de archivos
import { RPC_RESET, RPC_MESSAGE } from '../rpc-commands.mjs'  // Comandos RPC definidos

// Importaciones de Autopass y Corestore para manejo de contraseñas y almacenamiento
import Autopass from 'autopass'
import Corestore from 'corestore'
const { IPC } = BareKit  // Inter-Process Communication

// Define la ruta de almacenamiento dependiendo de la plataforma
// En Android usa una ruta específica, en otros casos usa una ruta local
const path =
  Bare.argv[0] === 'android'
    ? '/data/data/com.pederseo.penguinmobileautopass/autopass-example'
    : './tmp/autopass-example/'

// Inicializa el sistema RPC para comunicación bidireccional
const rpc = new RPC(IPC, (req, error) => {
  if (error) {
    console.error('Error en RPC:', error)
  }
})

// Limpieza inicial: elimina el directorio existente si existe
if (fs.existsSync(path)) {
  fs.rmSync(path, {
    recursive: true,
    force: true
  })
}

// Crea un nuevo directorio para almacenamiento
fs.mkdirSync(path)

// Obtiene el código de invitación de los argumentos de línea de comandos
const invite = Bare.argv[1]

// Inicializa Autopass con el almacenamiento y el código de invitación
const pair = Autopass.pair(new Corestore(path), invite)
const pass = await pair.finished()

// Espera a que Autopass esté listo para operar
await pass.ready()

// Escucha eventos de actualización en el sistema de contraseñas
pass.on('update', async (e) => {
  // Envía una señal de reinicio al frontend
  const req = rpc.request(RPC_RESET)
  req.send('data')

  // Itera sobre todas las contraseñas almacenadas
  for await (const data of pass.list()) {
    const value = JSON.parse(data.value)

    // Si el dato es una contraseña, la envía al frontend
    if (value[0] === 'password') {
      const req = rpc.request(RPC_MESSAGE)
      req.send(JSON.stringify(value))
    }
  }
}) 