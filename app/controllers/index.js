const express = require('express');

class AbstractController {
  constructor() {
    this.router = express.Router();

    this.initRouter();

    this.promisifyMiddlewares();
  }

  initRouter() {
    throw new Error('You must implement "initRouter" method');
  }

  promisifyMiddlewares() {
    this.router.stack.forEach(({ route }) => {
      route.stack.forEach((stack) => {
        if (stack.handle.constructor.name === 'AsyncFunction') {
          const oldHandle = stack.handle;

          // eslint-disable-next-line no-param-reassign
          stack.handle = AbstractController.wrapPromise(oldHandle);
        }
      });
    });
  }

  static wrapPromise(middleware) {
    return (request, response, next) => {
      middleware(request, response, next)
        .catch(next);
    };
  }
}

module.exports = AbstractController;
