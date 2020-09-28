#!/bin/ash

if [ -z "$MF_MQTT_CLUSTER" ]
then
      envsubst '${MF_MQTT_ADAPTER_MQTT_PORT}' < /etc/nginx/snippets/mqtt-upstream-single.conf > /etc/nginx/snippets/mqtt-upstream.conf
      envsubst '${MF_MQTT_ADAPTER_WS_PORT}' < /etc/nginx/snippets/mqtt-ws-upstream-single.conf > /etc/nginx/snippets/mqtt-ws-upstream.conf
else
      envsubst '${MF_MQTT_ADAPTER_MQTT_PORT}' < /etc/nginx/snippets/mqtt-upstream-cluster.conf > /etc/nginx/snippets/mqtt-upstream.conf
      envsubst '${MF_MQTT_ADAPTER_WS_PORT}' < /etc/nginx/snippets/mqtt-ws-upstream-cluster.conf > /etc/nginx/snippets/mqtt-ws-upstream.conf
fi

envsubst '
    ${MF_USERS_HTTP_PORT}
    ${MF_THINGS_HTTP_PORT}
    ${MF_HTTP_ADAPTER_PORT}
    ${MF_UI_PORT}
    ${MF_INFLUX_READER_PORT}
    ${MF_BOOTSTRAP_PORT}
    ${MF_TWINS_HTTP_PORT}
    ${MF_OPCUA_ADAPTER_HTTP_PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js

exec nginx -g "daemon off;"
