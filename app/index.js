const fs = require('fs');
const http = require('http');
const path = require('path');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');

class BlogApp {
  constructor() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
  }

  initServer() {
    this.app = express();
    this.server = http.Server(this.app);

    this.server.on('error', (error) => {
      console.error('Server error');
      console.log(error);
    });

    console.log('Server initialized');
  }

  initMiddlewares() {
    this.app.use(morgan('dev')); // logging

    this.app.use(bodyParser.json()); // payload
    this.app.use(bodyParser.urlencoded({ extended: true })); // payload

    console.log('Middlewares initialized');
  }

  initRoutes() {
    const controllersDir = path.join(__dirname, 'controllers');

    fs
      .readdirSync(controllersDir)
      .filter(filename => filename.substr(-3) === '.js' && filename !== 'index.js')
      .forEach((filename) => {
        const controllerFile = path.join(controllersDir, filename);
        const Controller = require(controllerFile);

        const controller = new Controller();
        this.app.use('/', controller.router);
      });

    console.log('Routes initialized');
  }

  async listen() {
    await new Promise((resolve, reject) => {
      this.server.listen(3000, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  async close() {
    await new Promise((resolve, reject) => {
      this.server.close((error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}

module.exports = BlogApp;
