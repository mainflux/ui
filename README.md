# Mainflux IoT Admin UI based on Angular 8+ and <a href="https://github.com/akveo/nebular">Nebular</a>

## Installation

### Quick Setup
For a quick setup, pre-built images from Docker Hub can be used.

First, make sure that `docker` and `docker-compose` are installed. Also, stop existing Mainflux containers if any.

Then, use the following instructions:
```
$ git clone https://github.com/mainflux/ui.git
$ cd ui
$ make run
```
UI should be now up and running at `http://localhost/`.

*(Note that `http://localhost:3000/` is for internal use only, and is not intended to be used by the end-user.)*

More configuration (port numbers, etc.) can be done by editing the `.env` file before `$ make run`.

### Developer Setup
For setting up a developer environment, Mainflux UI docker image must be built using the following command:
```
$ git clone https://github.com/mainflux/ui.git
$ cd ui
$ make ui
```
Then, to start the Mainflux UI as well as other Mainflux services, use the following command which internally uses `docker-compose`:
```
$ make run
```
For more developer tools, run `angular-cli`:
```
$ cd ui
$ npm install
$ npm start
```
### Cleaning Installation
To remove the installed containers and volumes, run:
```
$ make clean
```

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
