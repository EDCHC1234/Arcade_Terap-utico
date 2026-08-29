# Backend MQTT → Firebase

Este servicio escucha `arcade/+/metricas` en HiveMQ Cloud, valida cada mensaje
y lo guarda en Firebase Realtime Database. El `idMensaje` se usa como clave del
registro, por lo que un reenvio del mismo mensaje no crea duplicados.

## Configuracion

1. Copia `.env.example` como `.env`.
2. Completa `MQTT_PASSWORD` con la contrasena del usuario `arcade_backend`.
3. En Firebase/Google Cloud crea una cuenta de servicio con acceso de escritura
   a Realtime Database.
4. Configura `GOOGLE_APPLICATION_CREDENTIALS` con la ruta al JSON descargado,
   o usa `FIREBASE_SERVICE_ACCOUNT_BASE64` al desplegar en la nube.
5. Ejecuta `npm install` y luego `npm start`.

El backend conserva las rutas que ya escucha React:

- `Simondice`
- `Pintafeliz`
- `trazaFacil`
- `rescate`

No uses las credenciales del dashboard para este servicio. El SDK Admin necesita
una cuenta de servicio y debe ejecutarse solo en un servidor de confianza.
