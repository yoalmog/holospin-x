#include <WiFi.h>
#include <WebSocketsServer.h>

WebSocketsServer webSocket = WebSocketsServer(81);

const char* ssid = "HOLOSPIN_X";
const char* password = "12345678";

void setup() {
  Serial.begin(115200);

  WiFi.softAP(ssid, password);

  Serial.println(WiFi.softAPIP());

  webSocket.begin();
}

void loop() {
  webSocket.loop();
}
