const http = require('http');
const fs = require('fs');
const htmlContent = fs.readFileSync(__dirname + '/index.html', 'utf8');

http.createServer((request, response) => {
  let body = [];
  request.on('error', (err) => {
    console.log(err);
  }).on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    // console.log('body:', body);
    response.writeHead(200, { 'Content-Type': 'text/html', 'Trailer': 'Test-Header' });
    response.addTrailers({
      'Test-Header': 'abc',
    });
    response.end(htmlContent);
  })
}).listen(8088)

console.log('server listening: http://localhost:8088/');
