#include <WiFi.h>
#include <FirebaseESP32.h>

#define FIREBASE_HOST "esp32-flutter-firebase-7b9b6.firebaseio.com" 
#define FIREBASE_AUTH "DQAkV1J1LiRtlNg98TovG681IqhEI668xdbzxBeq"
#define WIFI_SSID "WANTED" //Sim precisa de internet
#define WIFI_PASSWORD "lsh7257e5"

//Define FirebaseESP32 data object
FirebaseData firebaseData;

// Root Path
String path = "/ESP32_Device";

/*****************************************************
 * OUTRAS BIBLIOTECAS 
 */
#include "Temperatura.h"

/*****************************************************/

float prev_temp;
float prev_humidity;
float t;

void setup() {
  Serial.begin(115200);

  initTemp();
  initWifi();
}

void loop() {
  delay(500);
  t = readDS18B20Temperature();
  Serial.print(F("Temperature: "));
  Serial.print(t);
  Serial.println(F("°C"));
  updateTemp(t);
}

void updateTemp(float temp){
  if(prev_temp != temp){
    String tempString = "";
    tempString += (int)temp;
    tempString += "C";
    prev_temp = temp;

    Firebase.setDouble(firebaseData, path + "/Temperature/Data", temp);
  }
}

void initWifi(){
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);

  //Set database read timeout to 1 minute (max 15 minutes)
  Firebase.setReadTimeout(firebaseData, 1000 * 60);
  //tiny, small, medium, large and unlimited.
  //Size and its write timeout e.g. tiny (1s), small (10s), medium (30s) and large (60s).
  Firebase.setwriteSizeLimit(firebaseData, "tiny");
}
