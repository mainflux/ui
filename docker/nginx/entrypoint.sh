#!/bin/ash

if [ -z "$MF_MQTT_CLUSTER" ]
then
      envsubst '${MF_MQTT_ADAPTER_MQTT_PORT}' < /usr/local/openresty/nginx/conf/snippets/mqtt-upstream-single.conf > /usr/local/openresty/nginx/conf/snippets/mqtt-upstream.conf
      envsubst '${MF_MQTT_ADAPTER_WS_PORT}' < /usr/local/openresty/nginx/conf/snippets/mqtt-ws-upstream-single.conf > /usr/local/openresty/nginx/conf/snippets/mqtt-ws-upstream.conf
else
      envsubst '${MF_MQTT_ADAPTER_MQTT_PORT}' < /usr/local/openresty/nginx/conf/snippets/mqtt-upstream-cluster.conf > /usr/local/openresty/nginx/conf/snippets/mqtt-upstream.conf
      envsubst '${MF_MQTT_ADAPTER_WS_PORT}' < /usr/local/openresty/nginx/conf/snippets/mqtt-ws-upstream-cluster.conf > /usr/local/openresty/nginx/conf/snippets/mqtt-ws-upstream.conf
fi

envsubst '
    ${MF_USERS_HTTP_PORT}
    ${MF_THINGS_HTTP_PORT}
    ${MF_THINGS_AUTH_HTTP_PORT}
    ${MF_HTTP_ADAPTER_PORT}
    ${MF_NGINX_MQTT_PORT}
    ${MF_NGINX_MQTTS_PORT}
    ${MF_AUTH_HTTP_PORT}
    ${MF_WS_ADAPTER_PORT}
    ${MF_UI_PORT}
    ${MF_INFLUX_READER_PORT}
    ${MF_BOOTSTRAP_PORT}
    ${MF_TWINS_HTTP_PORT}
    ${MF_OPCUA_ADAPTER_HTTP_PORT}' < /usr/local/openresty/nginx/conf/nginx.conf.template > /usr/local/openresty/nginx/conf/mfx.conf

envsubst '
    ${MF_NGINX_MQTT_PORT}
    ${MF_NGINX_MQTTS_PORT}' < /usr/local/openresty/nginx/conf/mqtt.conf.template > /usr/local/openresty/nginx/conf/mqtt.conf

exec /usr/local/openresty/bin/openresty -g "daemon off;" 
