# Árcade Terapéutico

Flujo de metricas:

```text
ESP32 -> Wi-Fi -> HiveMQ Cloud -> backend Node.js
      -> Firebase Realtime Database -> dashboard React
```

## Ejecutar backend y dashboard juntos

Desde la carpeta raiz del proyecto:

```powershell
cd C:\Users\danie\ProyectoSE
npm.cmd run dev
```

Este comando carga `backend/.env` para MQTT y Firebase Admin, y
`dashboard/.env` para la aplicacion React. Son configuraciones independientes y
pueden ejecutarse al mismo tiempo. Deten ambos servicios con `Ctrl+C`.

## Puesta en marcha

### 1. ESP32

1. Edita `include/secrets.h`.
2. Sustituye `CAMBIAR_POR_LA_CONTRASENA` por la contrasena de `arcade_esp32`.
3. Compila y carga el firmware con PlatformIO.

El dispositivo publica en `arcade/ESP32_001/metricas`. El archivo local de
secretos esta ignorado por Git; `include/secrets.example.h` sirve de plantilla.

### 2. Backend

1. Copia `backend/.env.example` como `backend/.env`.
2. Completa la contrasena del usuario MQTT y la credencial de Firebase Admin.
3. Desde `backend`, ejecuta `npm install` y `npm start`.

El usuario MQTT del backend debe poder suscribirse a
`arcade/+/metricas`. Consulta `backend/README.md` para la configuracion de la
cuenta de servicio de Firebase.

### 3. Dashboard

El dashboard sigue leyendo directamente las rutas existentes de Firebase, así
que no requiere cambios de estructura ni de despliegue.
