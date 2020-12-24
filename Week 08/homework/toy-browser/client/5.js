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
        console.log(data.toString());
        parser.receive(data.toString());
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
  constructor() {
    this.WAITING_STATUS_LINE = 0;
    this.WAITING_STATUS_LINE_END = 1;
    this.WAITING_HEADER_NAME = 2;
    this.WAITING_HEADER_SPACE = 3;
    this.WAITING_HEADER_VALUE = 4;
    this.WAITING_HEADER_LINE_END = 5;
    this.WAITING_HEADER_BLOCK_END = 6;
    this.WAITING_BODY = 7;

    this.current = this.WAITING_STATUS_LINE;
    this.statusLine = '';
    this.headers = {};
    this.headerName = '';
    this.headerValue = '';
    this.bodyParser = null;
  }
  receive(str) {
    for (let i = 0; i < str.length; i++) {
      this.receiveChar(str.charAt(i));
    }
  }
  receiveChar(char) {
    if (this.current === this.WAITING_STATUS_LINE) {
      if (char === '\r') {
        this.current = this.WAITING_STATUS_LINE_END;
      } else {
        this.statusLine += char;
      }
    } else if (this.current === this.WAITING_STATUS_LINE_END) {
      if (char === '\n') {
        this.current = this.WAITING_HEADER_NAME;
      }
    } else if (this.current === this.WAITING_HEADER_NAME) {
      if (char === ':') {
        this.current = this.WAITING_HEADER_SPACE;
      } else if (char === '\r') {
        this.current = this.WAITING_HEADER_BLOCK_END;
        // 初始化 bodyParser
        if (this.headers['Transfer-Encoding'] === 'chunked') {
          // chunked 是 Node.js 中默认的 Transfer-Encoding
          this.bodyParser = new TrunkedBodyParser();
        } else {
          // ...，还可以在这里初始化其他的 bodyParser，Transfer-Encoding 的不同，可能需要不同的 bodyParser
        }
      } else {
        this.headerName += char;
      }
    } else if (this.current === this.WAITING_HEADER_SPACE) {
      if (char === ' ') {
        this.current = this.WAITING_HEADER_VALUE;
      }
    } else if (this.current === this.WAITING_HEADER_VALUE) {
      if (char === '\r') {
        this.current = this.WAITING_HEADER_LINE_END;
        this.headers[this.headerName] = this.headerValue;
        this.headerName = '';
        this.headerValue = '';
      } else {
        this.headerValue += char;
      }
    } else if (this.current === this.WAITING_HEADER_LINE_END) {
      if (char === '\n') {
        this.current = this.WAITING_HEADER_NAME;
      }
    } else if (this.current === this.WAITING_HEADER_BLOCK_END) {
      if (char === '\n') {
        this.current = this.WAITING_BODY;
      }
    } else if (this.current === this.WAITING_BODY) {
      this.bodyParser.receiveChar(char);
    }
  }

  get isFinished() {
    return this.bodyParser && this.bodyParser.isFinished;
  }
  get response() {
    this.statusLine.match(/HTTP\/1\.1 ([0-9]+) ([\s\S]+)/);
    const responseData = {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.content.join(''),
    }
    if (this.headers['Transfer-Encoding'] === 'chunked' && this.bodyParser.trailerContent.length) {
      responseData.trailer = this.bodyParser.trailerContent.join('');
    }
    return responseData;
  }
}

class TrunkedBodyParser {
  constructor() {
    this.WAITING_LENGTH = 0;
    this.WAITING_LENGTH_LINE_END = 1;
    this.READING_TRUNK = 2;
    this.WAITING_NEW_LINE = 3;
    this.WAITING_NEW_LINE_END = 4;
    this.WAITING_TRAILER_LIN = 5;
    this.WAITING_TRAILER_LINE_END = 6;

    this.current = this.WAITING_LENGTH;
    this.length = 0;
    this.content = [];
    this.trailerContent = [];
    this.isFinished = false;
  }
  receiveChar(char) {
    if (this.current === this.WAITING_LENGTH) {
      if (char === '\r') {
        this.current = this.WAITING_LENGTH_LINE_END;
      } else {
        this.length += parseInt(char, 16);
      }
    } else if (this.current === this.WAITING_LENGTH_LINE_END) {
      if (char === '\n') {
        if (this.length === 0) {
          this.isFinished = true;
          this.current = this.WAITING_TRAILER_LIN;
        } else {
          this.current = this.READING_TRUNK;
        }
      }
    } else if (this.current === this.READING_TRUNK) {
      this.content.push(char);
      this.length--;
      if (this.length === 0) {
        this.current = this.WAITING_NEW_LINE;
      }
    } else if (this.current === this.WAITING_NEW_LINE) {
      if (char === '\r') {
        this.current = this.WAITING_NEW_LINE_END;
      }
    } else if (this.current === this.WAITING_NEW_LINE_END) {
      if (char === '\n') {
        this.current = this.WAITING_LENGTH;
      }
    } else if (this.current === this.WAITING_TRAILER_LIN) {
      if (char === '\r') {
        this.current = this.WAITING_TRAILER_LINE_END;
      } else {
        this.trailerContent.push(char);
      }
    } else if (this.current === this.WAITING_TRAILER_LINE_END) {
      if (char === '\n') {
        this.current = this.WAITING_NEW_LINE;
      }
    }
  }
}

void async function () {

  const request = new Request({
    method: 'POST',
    host: '127.0.0.1',
    port: 8088,
    path: '/',
    headers: {
      'TE': 'trailers',
      'X-Foo2': 'customed'
    },
    body: {
      name: 'lsnsh'
    }
  })

  const response = await request.send();

  console.log(response);
  // 输出：
  // {
  //   statusCode: '200',
  //   statusText: 'OK',
  //   headers: {
  //     'Content-Type': 'text/html',
  //     Trailer: 'Test-Header',
  //     Date: 'Thu, 24 Dec 2020 18:07:42 GMT',
  //     Connection: 'keep-alive',
  //     'Transfer-Encoding': 'chunked'
  //   },
  //   body: 'Hello World!',
  //   trailer: 'Test-Header: abc'
  // }

}();
