
# NeuroPlay — Arcade terapéutico inteligente

NeuroPlay es una plataforma de rehabilitación infantil que convierte la interacción con juegos físicos en datos útiles para el seguimiento terapéutico. Una consola basada en ESP32 ejecuta actividades lúdicas, registra el resultado de cada partida y envía las métricas a la nube. El terapeuta puede consultar esas sesiones en un dashboard web con indicadores, historial y gráficos en tiempo real.

![Terapeuta acompañando una actividad digital](https://lh3.googleusercontent.com/aida-public/AB6AXuCbvS_y9QIIXxXZAxcFBLQls-HKGwkspoWlNEtHgm5qV0Ov3RsXF7RDGCQFb6YfM7rxVCbqocNePVX5Oo8mpZI6ci79iDK308BCrvr3hg-axiwueGC_8gewWQAaEhGIYJADlBibwmJF010FehI1LW6WUf8gvKhtk1xFR92DgbhE4UixseDNZflIWr37i-FYNJsl-K8iroz49B9BZmsE0wz9t57VoNfzhICd02wD3IAQAVp4041ynrqpNVnUGgPybKTk0ASGZtz0AXf6)

![Arcade terapéutico utilizado en una sesión](https://lh3.googleusercontent.com/aida-public/AB6AXuDbvE7YvE60uwymmh4EHNiUmXWDsgHYxdRsYHKxs6hv_sSaXq1iGWZZmDoeh0kKeNEBzEezjae1eiUX1FEfgsiivvvcvg4YSaOPbjVrf0uB4A7OTJn9Fj0SZpc1M_gXNs6HvMS_xcdLPaja3od_iWJeQTWZSHR7mAxiBVFT6EdPH53U-r4IfxyPb6Gij7LK4J1VN_3IVVw7O4suzGTrpDwuC0bGju7a8tejNi0VXqalHjmDreJaielotKZsB8Is8G14b50xsraZLOe1)

## Video del resultado final

[Ver explicación y demostración del resultado final en YouTube](https://www.youtube.com/watch?v=A2JJskJFLy4)

## Objetivo

El proyecto busca apoyar a terapeutas ocupacionales y a sus pacientes mediante actividades que estimulan la atención, memoria, coordinación visomotora y motricidad fina. En lugar de conservar solo una impresión subjetiva de la sesión, NeuroPlay registra duración, resultado, puntaje o nivel alcanzado para observar el progreso con evidencia histórica.

> Esta plataforma es una herramienta de apoyo terapéutico y no reemplaza la valoración ni el criterio profesional de salud.

## Juegos y datos registrados

| Juego | Habilidad que apoya | Datos principales |
| --- | --- | --- |
| Simón Dice | Memoria, atención y respuesta a estímulos | Duración, resultado y puntaje |
| Pinta Feliz | Coordinación visomotora y precisión | Duración, resultado y nivel |
| Traza Fácil | Control y seguimiento de trayectorias | Duración y resultado |
| Rescate | Atención, coordinación y resolución de retos | Duración y resultado |

Cada sesión se publica como un JSON que incluye `idMensaje`, `dispositivoId`, `juego`, `duracion`, `duracionMs`, `resultado`, `fecha`, `hora` y `timestamp`. Según el juego, también puede contener `puntaje` o `nivel`.

## Arquitectura

```text
Jugador
  │
  ▼
Consola ESP32 ── Wi-Fi ──► HiveMQ Cloud (MQTT/TLS)
                                      │
                                      ▼
                           Backend Node.js
                           valida y transforma métricas
                                      │
                                      ▼
                     Firebase Realtime Database
                                      │
                                      ▼
                       Dashboard React + Vite
```

El firmware publica en `arcade/<ID_DEL_DISPOSITIVO>/metricas`. El backend se suscribe a `arcade/+/metricas`, verifica el formato y guarda las métricas bajo estas rutas de Firebase:

```text
Simondice/
Pintafeliz/
trazaFacil/
rescate/
```

## Componentes y tecnologías

### Hardware

- ESP32 Feather (entorno `featheresp32` de PlatformIO).
- Pantalla OLED SSD1306 de 128 × 64 px.
- Joystick analógico con pulsador.
- Cuatro botones de colores y LEDs de retroalimentación.
- Buzzer.
- Conexión Wi-Fi configurada desde un punto de acceso temporal del ESP32; las redes se guardan en EEPROM.

### Software y servicios

- Arduino/C++ y PlatformIO para el firmware.
- Bibliotecas: Adafruit GFX, Adafruit ILI9341, Adafruit SSD1306, PubSubClient y ArduinoJson.
- HiveMQ Cloud como broker MQTT con TLS.
- Node.js 20+ para el backend de integración.
- Firebase Realtime Database y Firebase Admin SDK para persistir métricas.
- React 19, Vite, Material UI, Chart.js, `react-chartjs-2`, Framer Motion y React Router para el dashboard.

## Estructura del repositorio

```text
ProyectoSE/
├── src/main.cpp                 # Firmware, juegos y publicación MQTT
├── src/apwifieeprommode.h       # Portal de configuración Wi-Fi y EEPROM
├── include/secrets.example.h    # Plantilla de credenciales MQTT del ESP32
├── platformio.ini               # Placa y dependencias de PlatformIO
├── backend/
│   └── src/
│       ├── index.js             # Suscripción MQTT y escritura en Firebase
│       └── metric.js            # Validación y mapeo de las métricas
├── dashboard/
│   └── src/
│       ├── firebase/firebase.js # Configuración del cliente Firebase
│       ├── services/gameService.js
│       └── pages/               # Vistas de inicio, terapeuta, paciente e historial
└── scripts/dev.js               # Inicio conjunto de backend y dashboard
```

## Cómo replicar el proyecto

### 1. Requisitos

- Node.js 20 o superior y npm.
- Visual Studio Code con la extensión PlatformIO IDE.
- Una placa ESP32 compatible con el perfil `featheresp32` y el montaje de los componentes indicados.
- Una cuenta/proyecto de Firebase con Realtime Database habilitada.
- Un clúster de HiveMQ Cloud y dos usuarios MQTT: uno para el ESP32 (publicar) y otro para el backend (suscribirse).

### 2. Instalar dependencias web

Desde la raíz del repositorio:

```powershell
npm install
npm --prefix backend install
npm --prefix dashboard install
```

### 3. Configurar Firebase

1. Cree un proyecto de Firebase y habilite **Realtime Database**.
2. Registre una aplicación web y copie su configuración pública.
3. Genere una cuenta de servicio en Firebase/Google Cloud con permiso de escritura en Realtime Database; descargue el archivo JSON y guárdelo fuera del repositorio.
4. Cree `dashboard/.env` con esta estructura:

```dotenv
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://tu-proyecto-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
# Solo si las reglas requieren iniciar sesión:
VITE_FIREBASE_EMAIL=lector@tu-dominio.com
VITE_FIREBASE_PASSWORD=...
```

5. Cree `backend/.env` con los datos de su broker y base de datos:

```dotenv
MQTT_HOST=tu-cluster.s1.eu.hivemq.cloud
MQTT_PORT=8883
MQTT_USERNAME=arcade_backend
MQTT_PASSWORD=...
MQTT_TOPIC=arcade/+/metricas
FIREBASE_DATABASE_URL=https://tu-proyecto-default-rtdb.firebaseio.com
GOOGLE_APPLICATION_CREDENTIALS=C:/ruta/segura/firebase-service-account.json
```

Como alternativa en un despliegue sin archivo JSON, defina `FIREBASE_SERVICE_ACCOUNT_BASE64` con el contenido Base64 de la cuenta de servicio. Nunca publique esos archivos ni las contraseñas.

### 4. Configurar el ESP32

1. Copie `include/secrets.example.h` como `include/secrets.h`.
2. Complete las credenciales de su clúster HiveMQ y un ID único para cada dispositivo.
3. Compile y cargue el firmware con PlatformIO.
4. Al arrancar, si no encuentra una red Wi-Fi almacenada, conecte un teléfono o computador a la red AP del ESP32 y abra `http://192.168.4.1` para ingresar SSID y contraseña. La red queda almacenada en EEPROM.

### 5. Ejecutar

Primero inicie backend y dashboard desde la raíz:

```powershell
npm run dev
```

También puede ejecutarlos de forma separada:

```powershell
npm run dev:backend
npm run dev:dashboard
```

Abra la dirección que muestre Vite, normalmente `http://localhost:5173`. Complete una partida en la consola y compruebe que el backend muestre una métrica guardada; después aparecerá en el dashboard.

## Cambios que debe realizar cada usuario

No se requiere modificar el código para usar otro proyecto Firebase o broker HiveMQ: las credenciales están separadas en archivos de configuración ignorados por Git. Estos son los cambios obligatorios.

| Archivo o sección | Qué cambiar | Motivo |
| --- | --- | --- |
| `include/secrets.h` | `MQTT_HOST`, `MQTT_PORT`, `MQTT_DEVICE_ID`, `MQTT_USERNAME`, `MQTT_PASSWORD` y, de ser posible, `MQTT_ROOT_CA`. | Conecta el ESP32 a su clúster HiveMQ y lo identifica en el tópico. |
| `backend/.env` | Variables `MQTT_*`, `FIREBASE_DATABASE_URL` y la credencial de Firebase Admin. | Permite al backend recibir métricas y escribir en su base de datos. |
| `dashboard/.env` | Todas las variables `VITE_FIREBASE_*`; agregue `VITE_FIREBASE_EMAIL` y `VITE_FIREBASE_PASSWORD` solo si usa autenticación. | Conecta la interfaz a su Firebase. |
| Reglas de Firebase | Autorice la lectura al dashboard según su modelo de autenticación; mantenga la escritura restringida al backend mediante Admin SDK. | Protege los datos de las sesiones. |

### Líneas de código que solo debe cambiar si personaliza la estructura

Si conserva el tópico `arcade/<dispositivo>/metricas` y las cuatro rutas de Firebase, **no cambie estos archivos**. Si necesita otra estructura, los puntos que deben mantenerse coherentes son:

| Archivo | Ubicación aproximada | Cambio necesario |
| --- | --- | --- |
| `src/main.cpp` | Función `enviarMetricaJuego`, al construir `topic` | Cambie `arcade/` o `metricas` si su tópico MQTT usa otro prefijo o sufijo. |
| `backend/src/index.js` | Constante `mqttTopic` | Use el mismo patrón de suscripción, por ejemplo `mi-prefijo/+/datos`. También puede definirlo sin editar código mediante `MQTT_TOPIC` en `.env`. |
| `backend/src/metric.js` | Función `parseMetric`, expresión regular del tópico | Actualice la validación para que acepte exactamente el nuevo formato de tópico. |
| `backend/src/metric.js` | Mapa `GAME_PATHS` | Modifique las rutas de Firebase si agrega, renombra o elimina juegos. |
| `dashboard/src/utils/gameData.js` | Constante `GAMES` | Actualice las rutas y nombres para que el dashboard lea las mismas rutas que usa el backend. |

Para evitar errores, el valor de `MQTT_DEVICE_ID` del ESP32 debe coincidir con el segmento `<dispositivo>` del tópico publicado. El backend lo valida antes de guardar la métrica. Asimismo, cualquier ruta que se cambie en `GAME_PATHS` debe reflejarse en `GAMES` del dashboard.

## Verificación y solución rápida de problemas

1. Ejecute `npm run check` para validar el backend y generar una compilación de producción del dashboard.
2. Si el ESP32 no publica, revise el monitor serial: debe indicar conexión Wi-Fi y `MQTT conectado`.
3. Si el backend no recibe datos, confirme que el usuario MQTT tiene permiso para suscribirse a `arcade/+/metricas` y que las credenciales coinciden.
4. Si Firebase no recibe registros, revise `FIREBASE_DATABASE_URL`, la ruta de la cuenta de servicio y los permisos del proyecto.
5. Si el dashboard dice que falta Firebase, complete `dashboard/.env` y reinicie Vite. Las variables de Vite se leen al arrancar el servidor.

## Seguridad

- No suba `include/secrets.h`, `backend/.env`, `dashboard/.env` ni el JSON de la cuenta de servicio.
- Use credenciales MQTT diferentes para el ESP32 y para el backend, con permisos mínimos.
- Mantenga TLS activo en HiveMQ (`MQTTS`, puerto 8883) y configure el certificado raíz en el ESP32 cuando sea posible.
- Proteja el acceso de lectura del dashboard con reglas de Firebase y autenticación si los datos corresponden a pacientes reales.
