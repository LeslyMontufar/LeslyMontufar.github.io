#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <SPIFFS.h>

const char* ssid = "WANTED"; // NOME DA REDE
const char* password = "lsh7257e5"; // SENHA DA REDE

// Create AsyncWebServer object on port 80
AsyncWebServer server(80);

/*****************************************************
 * TEMPERATURA
 */
 
#include "Temperatura.h"
#define pinoDS18B20 15 // PINO DO SENSOR DE TEMPERATURA

OneWire oneWire(pinoDS18B20);
DallasTemperature sensors(&oneWire);
DeviceAddress sensor1;
 
/*****************************************************
 * SETUP
 */
 
void setup(){
  // Serial port for debugging purposes
  Serial.begin(115200);

  // Sensor de Temperatura
  sensors.begin();
  verifica_contato_sensor_DS18B20(sensors, sensor1);
  pinMode(LED_BUILTIN, OUTPUT);

  // Initialize SPIFFS
  if(!SPIFFS.begin()){
    Serial.println("Error! Error! SPIFFS!");
    return;
  }

  // Connect to Wi-Fi
  Serial.print("Conectando o ESP32 ao WiFi");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(300);
    Serial.print(".");
  }

  // Print ESP32 Local IP Address
  Serial.println();
  Serial.print("Meu endereço IP: ");
  Serial.println(WiFi.localIP());

  // Route for root / web page
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/index.html"); // manda requerimento para o servidor
  });
  server.on("/style.css", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/style.css", "text/css");
  });
  server.on("/temperatura.js", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/temperatura.js", "text/javascript");
  });
  server.on("/aquecer.js", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/aquecer.js", "text/javascript");
  });

  // tags para comunicacao
  server.on("/temperature", HTTP_GET, [](AsyncWebServerRequest *request){ //HTTP_GET indica que existe comunicacao
    request->send_P(200, "text/plain", readDS18B20Temperature(sensors, sensor1).c_str());
  });
  server.on("/aquecer", HTTP_GET, [](AsyncWebServerRequest *request){ //HTTP_GET indica que existe comunicacao
    request->send_P(200, "text/plain", aquecer().c_str());
  });

  // Start server
  server.begin();
}
 
void loop(){
  
}
