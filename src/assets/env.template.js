(function(window) {
  window["env"] = window["env"] || {};
  var envProxyAuth = "${MF_PROXY_AUTH}";
  // Environment variables
  window["env"]["mqttWsUrl"] = "${MF_UI_MQTT_WS_URL}";
  window["env"]["proxyAuth"] = envProxyAuth === 'true';
  window["env"]["logoutUrl"] = "${MF_PROXY_LOGOUT_URL}";
  window["env"]["appPrefix"] = "${MF_UI_APP_PREFIX}";
})(this);
