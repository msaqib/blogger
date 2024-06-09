// server.js
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const customMiddleware = require('./middleware');

server.use(middlewares);
server.use(customMiddleware); // Use the custom middleware
server.use(router);
server.listen(3001, () => {
  console.log('JSON Server is running with delay on port 3001');
});