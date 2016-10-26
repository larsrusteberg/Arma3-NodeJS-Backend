const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
res.setHeader('Content-Type', 'text/plain');
res.end('Hello World\n');
});

server.listen(0, '0.0.0.0', () => {
  console.log('Node.js app is running...');
});