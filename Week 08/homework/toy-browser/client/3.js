const net = require('net');

class Request {
  constructor(option) {
    this.method = option.method || 'GET';
    this.host = option.host || '';
    this.port = option.port || 80;
    this.path = option.path || '/';
    this.headers = option.headers || {};
    this.body = option.body || {};
    if (!this.headers['Content-Type']) {
      this.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    if (this.headers['Content-Type'] === 'application/json') {
      this.bodyText = JSON.stringify(this.body);
    } else if (this.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&');
    }

    this.headers['Content-Length'] = this.bodyText.length;
  }

  send(connection) {
    return new Promise((resolve, reject) => {
      const parser = new ResponseParser();

      if (connection) {
        connection.write(this.toString());
      } else {
        connection = net.createConnection({
          host: this.host,
          port: this.port
        }, () => {
          connection.write(this.toString());
        })
      }

      connection.on('data', data => {
        console.log('connection receive:', data.toString());
        parser.receive(data.toString());
        // 下一节完善 ResponseParser 的逻辑
        if (parser.isFinished) {
          resolve(parser.response);
          connection.end();
        }
      })

      connection.on('error', err => {
        reject(err);
        connection.end();
      })
    })
  }

  toString() {
    return [
      `${this.method} ${this.path} HTTP/1.1`,
      `Host: ${this.host}:${this.port}`,
      Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n'),
      '',
      this.bodyText
    ].join('\r\n');
  }
}

class ResponseParser {
  constructor() { }
  receive(str) {
    for (let i = 0; i < str.length; i++) {
      this.receiveChar(str.charAt(i));
    }
  }
  receiveChar(char) {
    // ...
  }
}

void async function () {

  const request = new Request({
    method: 'POST',
    host: '127.0.0.1',
    port: 8088,
    path: '/',
    headers: {
      'X-Foo2': 'customed'
    },
    body: {
      name: 'lsnsh'
    }
  })

  const response = await request.send();

  console.log(response);

}();
