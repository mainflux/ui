(function(window) {
    window["env"] = window["env"] || {};
  
    // Environment variables
    window["env"]["mqttWsUrl"] = "${MF_UI_MQTT_WS_URL}";
    window["env"]["proxyAuth"] = "${MF_PROXY_AUTH}";
  })(this);