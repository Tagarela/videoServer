Video Server
========================

### Version
0.0.1

### Tech

* [node.js] - evented I/O for the backend
* [Express] - fast node.js network app framework
* [mongoose] - orm for mongodb
* [swagger] - framework for documenation

Install project
--------------
- Create config file

> Project can be configured in 3 environments (prod, dev, test)
> dev - development environment
> prod - production environment
> test - test environment

copy and modify config file

* prod
    
```sh
$ cp -r config/env.dist config/prod
```

* dev
    
```sh
$ cp -r config/env.dist config/dev
```

* test
    
```sh
$ cp -r config/env.dist config/test
```

Install ffmpeg on ubuntu
* [ffmpeg] 

```sh
$ sudo apt-get install ffmpeg
```

Install mongodb on ubuntu

Create uploads folder

```sh
$ mkdir uploads
$ sudo chmod -R 777 uploads
```

Install npm pakckages

```sh
$ npm install
```

Run Project
--------------

```sh
$ NODE_ENV=prod npm start
```

- forever

```sh
NODE_ENV=prod forever start app.js
```

Run Unit Tests
--------------
```sh
npm test
```

[node.js]: <http://nodejs.org>
[express]: <http://expressjs.com>
[ffmpeg]: <http://www.ubuntugeek.com/install-ffmpeg-on-ubuntu-14-10-using-ppa.html>
[swagger]: <http://swagger.io>
