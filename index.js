const App = require('./app');

const app = new App();

app.listen()
  .then(() => console.log('ok'))
  .catch(error => console.error(error));
