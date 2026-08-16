#pragma once

// Copia este archivo como include/secrets.h y completa la contrasena del
// usuario "arcade_esp32" creado en HiveMQ Cloud.
#define MQTT_HOST "5ebcb7b600d745958e69f7a46f82ef48.s1.eu.hivemq.cloud"
#define MQTT_PORT 8883
#define MQTT_DEVICE_ID "ESP32_001"
#define MQTT_USERNAME "arcade_esp32"
#define MQTT_PASSWORD "CAMBIAR_POR_LA_CONTRASENA"

// Opcional pero recomendado: pega aqui el certificado raiz PEM que valida el
// certificado TLS del cluster. Si queda vacio, la conexion sigue cifrada pero
// el ESP32 no verifica la identidad del broker.
#define MQTT_ROOT_CA ""
