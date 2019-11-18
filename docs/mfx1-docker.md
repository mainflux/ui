### Docker deployment on MFX-1

On MFX-1 gateway with installed Debian GNU/Linux 9.5 (stretch), follow procedure on https://docs.docker.com/install/linux/docker-ce/debian/ for `armhf` architecture:

Update the apt package index:

```
sudo apt-get update
```
Install packages to allow apt to use a repository over HTTPS:

```
sudo apt-get install \
   apt-transport-https \ 
   ca-certificates \ 
   curl \ 
   gnupg2 \ 
   software-properties-common
```
Add Docker’s official GPG key:

```
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add -
```

Verify that you now have the key with the fingerprint 9DC8 5822 9FC7 DD38 854A E2D8 8D81 803C 0EBF CD88, by searching for the last 8 characters of the fingerprint.
```
sudo apt-key fingerprint 0EBFCD88
```

Use the following command to set up the stable repository:
```
sudo add-apt-repository \
   "deb [arch=armhf] https://download.docker.com/linux/debian \
   $(lsb_release -cs) \
   stable"
```
Update the apt package index:
```
sudo apt-get update
```
Install the latest version of Docker CE and containerd:

```
sudo apt-get install docker-ce docker-ce-cli containerd.io
```

Verify that Docker CE is installed correctly by running the hello-world image:
```
sudo docker run hello-world
```

### Installing docker-compose on MFX-1 gateway with installed Debian GNU/Linux 9.5 (stretch):

```
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py && sudo python3 get-pip.py
sudo apt install libffi-dev
pip3 install setuptools
sudo apt-get install libsodium-dev
sudo apt-get install build-essential libssl-dev python3-dev
sudo pip3 install docker-compose
```