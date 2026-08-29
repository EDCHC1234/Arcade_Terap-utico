# Dashboard de juegos ESP32

Aplicación web independiente que escucha Firebase Realtime Database en tiempo real mediante `onValue()`.

## Puesta en marcha

1. Instala Node.js LTS (incluye npm).
2. En esta carpeta, ejecuta `npm install`.
3. Copia `.env.example` a `.env` y completa la configuración web de Firebase disponible en la consola de Firebase, sección **Configuración del proyecto > Tus aplicaciones > Web**. Si tus reglas exigen autenticación, completa también las dos variables de usuario del dashboard (idealmente con una cuenta de solo lectura).
4. Ejecuta `npm run dev`.

El dashboard lee las rutas de Firebase exactamente como están definidas: `Simondice`, `Pintafeliz`, `trazaFacil` y `rescate`.

Los nuevos registros del ESP32 también incluyen `duracionMs`, `timestamp`, `juego` y, cuando aplica, `puntaje` o `nivel`; los campos históricos se conservan intactos.
