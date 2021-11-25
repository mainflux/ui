# Mainflux IoT Admin UI based on Angular 8+ and <a href="https://github.com/akveo/nebular">Nebular</a>

## Prerequisites

The following are needed to run the UI:

- [Docker](https://docs.docker.com/install/) (version 20.10)
- [Docker compose](https://docs.docker.com/compose/install/) (version 1.28)

## Install
For a quick setup, pre-built images from Docker Hub can be used.

First, make sure that `docker` and `docker-compose` are installed. Also, stop existing Mainflux containers if any.

Then, use the following instructions:
```bash
git clone https://github.com/mainflux/ui.git
cd ui
make run
```
UI should be now up and running at `http://localhost/`.

*(Note that `http://localhost:3000/` is for internal use only, and is not intended to be used by the end-user.)*

More configuration (port numbers, etc.) can be done by editing the `.env` file before `make run`.

## Usage
A developer build from the source can be achieved using the following command:
```bash
make ui
```
Then, to start the Mainflux UI as well as other Mainflux services:
```bash
make run
```
For more developer tools, run `angular-cli`:
```bash
cd ui
npm install
npm start
```
## Uninstall
To remove the installed containers and volumes, run:
```bash
make clean
```

## Behind a proxy
When using authentication with proxy like Oauth2-proxy we dont need a login form. UI only needs to check if there is authenticated session by accessing `/tokens` endpoint.
Request to `/tokens` endpoint in this use case is also handled by proxy. When UI receieves token it can be assumed that authentication is successfull, requests to backend will
be authenticated by the means of authenticated session on proxy so `token` is not needed to authenticate requests but it may be used for restricting access to some endpoints (e.g. based on a role in token)
To use UI in this mode where backend is behind authentication proxy you need to set envs in `.env`.
* `MF_PROXY_AUTH=true`
* `MF_PROXY_LOGOUT_URL=/logout (this may be optional depending on the proxy being used)`


## Preview

##
![dashboard][dashboard]

##
![things][things]

##
![details][details]

[dashboard]: https://github.com/mainflux/docs/blob/master/docs/img/ui/dashboard.png
[things]: https://github.com/mainflux/docs/blob/master/docs/img/ui/things.png
[details]: https://github.com/mainflux/docs/blob/master/docs/img/ui/details.png
