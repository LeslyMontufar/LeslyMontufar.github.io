/*****************************************************
 * LEITURA DA TEMPERATURA
 */

#include<OneWire.h>
#include<DallasTemperature.h>
#define pinoDS18B20 15 // PINO DO SENSOR DE TEMPERATURA

OneWire oneWire(pinoDS18B20);
DallasTemperature sensors(&oneWire);
DeviceAddress sensor1;




void verifica_contato_sensor_DS18B20() {
  Serial.println("\n***********************************************");
  Serial.println("Localizado sensores DS18B20...");
  Serial.print("Foram encontrados ");
  Serial.print(sensors.getDeviceCount(), DEC); //DallasTemperature
  Serial.println(" sensores.");

  if (!sensors.getAddress(sensor1, 0)) //DeviceAddress
    Serial.println("Sensores nao encontrados !");
  Serial.print("Endereco sensor: ");
  for (uint8_t i = 0; i < 8; i++) { //i era de 16bits com a parte negativa
    if (sensor1[i] < 16) Serial.print("0");
    Serial.print(sensor1[i], HEX);
  }
  Serial.println("\n***********************************************\n");
}

float readDS18B20Temperature() {
  sensors.requestTemperatures();
  float t = sensors.getTempC(sensor1); //envia o endereço

  if (isnan(t)) {    
    Serial.println("Falha em ler o sensor DS18B20!");
    return 0;
  }
  else {
    return t;
  }
}

/*****************************************************
 * AQUECIMENTO DO AQUARIO
 */

 float TEMP_IDEAL_MIN = 26.5; // 21
 float TEMP_IDEAL_MAX = 27; // 25
 float DT = TEMP_IDEAL_MAX - TEMP_IDEAL_MIN;
 #define LED_BUILTIN 2 // PINO DO LED PARA TESTE

 void aquecimento(float t) {
  if (t < TEMP_IDEAL_MIN){
    digitalWrite(LED_BUILTIN, HIGH);
    Serial.println("\t  Frio -> Ligar aquecimento");
  } else if(t > TEMP_IDEAL_MAX - (DT)/4) {
    digitalWrite(LED_BUILTIN, LOW);
    Serial.println("\t  Quente -> Desligar aquecimento");
  } else {
    Serial.println("\t  Dentro da faixa de temp ideal");
  }
 }


void initTemp() {
  // Sensor de Temperatura
  sensors.begin();
  verifica_contato_sensor_DS18B20();
  pinMode(LED_BUILTIN, OUTPUT);
}
