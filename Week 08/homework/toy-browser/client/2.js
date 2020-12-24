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

  send() {
    return new Promise((resolve, reject) => {
      const parser = new ResponseParser();
      resolve('');
      // ...
      // 下一节完善 send 的逻辑
    })
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
    method: 'post',
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
