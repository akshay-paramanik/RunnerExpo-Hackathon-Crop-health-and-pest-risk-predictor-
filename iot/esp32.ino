#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// ---------- WIFI ----------
const char* ssid = "YOUR_SSID/WIFI_NAME";
const char* password = "YOUR_PASSWORD/WIFI_PASSWORD";

const char* serverName = "https://xxxx.ngrok-free.app/store";

// ---------- SENSOR ----------
#define DHTPIN 4
#define DHTTYPE DHT11
#define SOIL_PIN 34

DHT dht(DHTPIN, DHTTYPE);
LiquidCrystal_I2C lcd(0x27, 16, 2);

// ---------- TIMERS ----------
unsigned long lastApiCall = 0;
unsigned long lastRead = 0;

const long apiInterval = 50000;   // 50 sec
const long readInterval = 2000;   // 2 sec

float temp = 0;
float hum = 0;
int soil = 0;

// ---------- WIFI ----------
void connectWiFi() {
  Serial.print("Connecting WiFi...");
  WiFi.begin(ssid, password);

  int retry = 0;
  while (WiFi.status() != WL_CONNECTED && retry < 20) {
    delay(500);
    Serial.print(".");
    retry++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nConnected!");
  } else {
    Serial.println("\nWiFi Failed!");
  }
}

// ---------- SEND DATA ----------
void sendData() {
  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
  }

  HTTPClient http;
  http.begin(serverName);
  http.addHeader("Content-Type", "application/json");

  String json = "{";
  json += "\"temperature\":" + String(temp, 1) + ",";
  json += "\"humidity\":" + String(hum, 1) + ",";
  json += "\"soil_moisture\":" + String(soil);
  json += "}";

  Serial.println("Sending: " + json);

  int httpCode = http.POST(json);

  if (httpCode > 0) {
    Serial.println("Response: " + http.getString());
  } else {
    Serial.println("Error sending data");
  }

  http.end();
}

// ---------- SETUP ----------
void setup() {
  Serial.begin(115200);

  dht.begin();

  Wire.begin(21, 22);
  lcd.init();
  lcd.backlight();

  lcd.setCursor(0,0);
  lcd.print("System Start");

  connectWiFi();
}

// ---------- LOOP ----------
void loop() {

  unsigned long now = millis();

  // -------- SENSOR READ --------
  if (now - lastRead >= readInterval) {
    lastRead = now;

    float t = dht.readTemperature();
    float h = dht.readHumidity();
    int rawSoil = analogRead(SOIL_PIN);

    if (isnan(t) || isnan(h)) {
      Serial.println("DHT ERROR!");
    } else {
      temp = t;
      hum = h;
    }

    soil = map(rawSoil, 4095, 0, 0, 100);

    Serial.println("------");
    Serial.print("Temp: "); Serial.println(temp);
    Serial.print("Hum : "); Serial.println(hum);
    Serial.print("Soil: "); Serial.println(soil);

    // LCD Update
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("T:"); lcd.print(temp);
    lcd.print(" H:"); lcd.print(hum);

    lcd.setCursor(0,1);
    lcd.print("Soil:"); lcd.print(soil); lcd.print("%");
  }

  // -------- API CALL --------
  if (now - lastApiCall >= apiInterval) {
    lastApiCall = now;
    sendData();
  }
}