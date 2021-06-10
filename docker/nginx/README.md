# Openresty configuration

Prior to the starting the composition `mainflux-nginx` image must be built using [Dockerfile](Dockerfile)

```
pwd
../ui/docker
docker build --tag=mainflux-nginx -f Dockerfile .
```

When starting `openresty` image we must mount our own `nginx.conf` as a volume, we cannot rely on `entrypoint.sh` to parse template configuration and create `nginx.conf`.
So we mount `nginx.conf` which will include configuration files that should be parsed and adjusted according to environment variables.

- `nginx-key.conf` will be mounted as volume in case of plain HTTP, it will include `mfx.conf` which will be result of parsing `mfx-key.conf`. Similar it will include `mqtt.conf` which is result of parsing `mqtt-key.conf` in `entrypoint.sh`.
- `nginx-x509.conf` will be mounted as volume in case of HTTPS it will include `mfx.conf` which will be result of parsing `mfx-x509.conf`. Additionaly it includes `mqtt.conf` which is result of parsing `mqtt-x509.conf` in `entrypoint.sh`
