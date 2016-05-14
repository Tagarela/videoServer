Video Server
========================

Install project
--------------
- Install npm packages

```sh
$ npm install
```

- Install ffmpeg on ubuntu

```sh
$ sudo apt-get install ffmpeg
```
(http://www.ubuntugeek.com/install-ffmpeg-on-ubuntu-14-10-using-ppa.html)

Run Project
--------------
- npm

```sh
$ NODE_ENV=prod npm start
```
- forever

```sh
NODE_ENV=prod forever start app.js
```
