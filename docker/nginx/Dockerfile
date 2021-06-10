FROM openresty/openresty:alpine-fat

RUN mkdir -p /var/log/nginx && \
    ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log

RUN /usr/local/openresty/luajit/bin/luarocks install lua-resty-http
RUN /usr/local/openresty/luajit/bin/luarocks install lua-cjson
RUN /usr/local/openresty/luajit/bin/luarocks install lua-resty-session
RUN /usr/local/openresty/luajit/bin/luarocks install lua-resty-openidc

RUN mkdir -p /data/nginx/cache/ui

ENTRYPOINT ["/entrypoint.sh"]
