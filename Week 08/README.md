# 第 8 周｜浏览器工作原理（一）

## 本周作业

**必做：**

- [不使用状态机处理字符串 - 找到字符“a”](./homework/state-machine/1.js)
- [不使用状态机处理字符串 - 找到字符“ab”](./homework/state-machine/2.js)
- [不使用状态机处理字符串 - 找到字符“abcdef”](./homework/state-machine/3.js)
- [使用状态机处理字符串 - 找到字符“abcdef”](./homework/state-machine/4.js)
- [使用状态机处理字符串 - 找到字符“abcabx”](./homework/state-machine/5.js)
- [使用状态机处理字符串 - 找到字符“abababx”](./homework/state-machine/6.js)
- [HTTP 请求 - 服务端环境准备](./homework/toy-browser/server.js)
- [HTTP 请求 - 实现一个 HTTP 的请求](./homework/toy-browser/client/1.js)
- [HTTP 请求 - send 函数的编写](./homework/toy-browser/client/2.js)
- [HTTP 请求 - 发送请求](./homework/toy-browser/client/3.js)
- [HTTP 请求 - response 解析](./homework/toy-browser/client/4.js)
- [HTTP 请求 - response body 的解析](./homework/toy-browser/client/5.js)

**选做：**

- 如何用状态机处理完全未知的 pattern（字符串串） ？
  - 参考资料：[字符串 KMP 算法](https://en.wikipedia.org/wiki/Knuth%E2%80%93Morris%E2%80%93Pratt_algorithm)

## 本周总结

本周学习了浏览器的工作原理之 状态机处理字符串、HTTP 协议解析和如何实现 HTPP 请求。

### 浏览器工作原理

浏览器（以 Toy-Browser 为例）是由以下五个步骤，完成整体的渲染：

- URL
  - HTTP
- HTML
  - parse
- DOM
  - css computing
- DOM with CSS
  - layout
- DOM with position
  - render
- Bitmap

当我们打开浏览器，访问某个网址时，从计算机到显示器屏幕，最后显示的一定是图片的形式，计算机术语叫做 `Bitmap - 位图`。只有将这个东西传递给显卡驱动设备，才能转换成我们人眼可以识别的光信号，也就是在显示器屏幕上所能看到具体网站的网页内容。

### 浏览器工作原理之 HTTP 解析

#### ISO-OSI 七层网络模型

- HTTP

  > require('http')

  1. 应用层
  2. 表示层
  3. 会话层

- TCP/UDP

  > require('net')

  1. 传输层

- Internet（IP - Internet Protocol）

  5. 网络层

- 4G/5G/Wi-Fi

  6. 数据链路层
  7. 物理层

在实现 `Toy-Browser` 的过程中，为了去了解浏览器的工作原理，我们不会直接引用 `http` 包，而是要自己实现一个。

目标是使用 `Node.js` 中的 `net` 包，去完成 `Toy-Browser` 对于 `HTTP` 的请求和 `HTTP` 的响应的处理。

#### TCP/IP 的基础知识

- 流
  - 传输数据的概念，没有明显的分割单位，只保证前后的顺序是正确的
- 端口
  - 每一个应用都会去通过网卡获取数据，那具体哪些数据是给哪个应用的呢？这时候就端口概念的存在就很好的解决了这问题。
  - 计算机的网卡是根据端口，把接收到的数据包分给各个应用的
- require('net');
  - 端口对应到 `Node.js` 中，就需要用到 `net` 这个包
- 包
  - 数据包，可大可笑，TCP 中传输的概念
- IP 地址
  - 决定了数据包从哪里到哪里
- libnet/libpcap
  - IP 协议的一些底层库，用 C++ 实现的
  - Node.js 底层会调用这两个库
  - libnet 负责构造 IP 包并且发送
  - libpcap 负责从网卡抓所有的流经你的网卡的 IP 包
    - 如果使用交换机而不是路由器去组网，通过这个 libpcap 库能抓取到很多本来不属于发给你的 IP 包；
    - 通常网卡是会过滤掉这些 IP 包；
    - 但是由于 libpcap 是一个 IP 层的基础库，所以能够抓取到这些本不属于你的 IP 包。
    - 也是很多特殊的 IP 协议（SOCKS, VLESS）处理所需要用的技术

#### HTTP 基础知识

`TCP` 是全双工通道，能互相通信，不存在优先关系；但是 `HTTP` 是必须先有客户端发起一个 `Request`，然后服务端返回一个 `Response`，每个 `Request` 都对应一个 `Response`，如果对不上的话，那么协议可能出错了。

- Request
- Response

`HTTP` 是文本型协议，是和二进制的协议相对的，文本型协议中所有内容都是字符串，每个字节都是字符串的一部分，比如要传输 `1`，不会传输 `1` 的二进制数据，而是传输 `1` 的 `Unicode` 或者 `ASCII` 编码格式的数据。

`HTTP` 协议是在 `TCP` 协议的上层，所以说流淌在 `TCP` 协议的流里面的所有的内容都可以视为是字符。

#### HTTP Request

```http
<!-- Request Line-->
POST / HTTP/1.1
<!-- Headers -->
Host: localhost:8088
Content-Type: application/x-www-form-urlencoded
Content-Length: 21
<!-- Body -->

field1=aaa&code=x%3D1
```

上面是一个 `POST` 请求的 `HTTP` 示例代码，主要由三部分组成：

- Request Line
  - Method
  - Path(default: /)
  - HTTP/HTTP Version
- Headers
  - Host:Port
  - Other
- Body

`Method` 、`Path` `Headers` 都是 `HTTP` 协议要求的，`Headers` 中的 `Host` 是 `IP` 协议要求，`Port` 是 `TCP` 协议要求的。

##### 第一步-实现一个 `HTTP` 的请求的总结：

- 设计一个 `HTTP` 请求的类
- `Content-Type` 是一个必要字段，要有默认值
- `body` 是 `key/value` 对的格式
- 不同的 `Content-Type` 影响 `body` 中数据的格式

##### 第二步-`send` 函数的总结：

- 在 Request 类的构造函数中收集必要的信息
- 设计一个 `send` 函数，把请求真实的发送到服务器
- `send` 函数应该是异步的，所以返回 `Promise`

##### 第三步-发送请求：

- 设计支持已有的 `connection` 或者自己新建 `connection`
- 收到数据传给 `parser`
- 根据 `parser` 的状态 `resolve Promise`

#### HTTP Response

```http
<!-- Status Line -->
HTTP/1.1 200 OK
<!-- Headers -->
Content-Type: text/html
Date: Thu, 24 Dec 2020 07:27:19 GMT
Connection: keep-alive
Transfer-Encoding: chunked
<!-- Body -->

d
Hello World!

0

```

上面是一个 `HTTP` 响应的示例代码，主要由三部分组成：

- Status Line
  - HTTP/HTTP Version
  - HTTP Status Code
  - HTTP Status Text
- Headers
- Body
  - Chunk Length（16 进制数）
  - Body Text
  - 0\r\n\r\n

##### 第四步-ResponseParser 总结：

- Response 必须分段构造，所以我们要用一个 ResponseParser 来“装配”
- ResponseParser 分段处理 ResponseText，我们用状态机来分析文本的结构

##### 第五步-BodyParser 总结：

- `Response` 的 `body` 可能根据 `Content-Type` 有不同的结构，因此我们会才用子 `Parser` 的结构来解决问题
- 以 `TrunkedBodyParser` 为例，我们同样用状态机来处理 `body` 中的数据

### 遇到的问题

#### argument must be an instance of Buffer or Uint8Array. Received type string

```
buffer.js:574
      throw new ERR_INVALID_ARG_TYPE(
      ^

TypeError [ERR_INVALID_ARG_TYPE]: The "list[0]" argument must be an instance of Buffer or Uint8Array. Received type string ('name=lsnsh')
    at Function.concat (buffer.js:574:13)
    at IncomingMessage.<anonymous> (/Users/lsnsh/study/github/Frontend-06-Template/Week 08/homework/toy-browser/server.js:11:19)
    at IncomingMessage.emit (events.js:327:22)
    at endReadableNT (internal/streams/readable.js:1327:12)
    at processTicksAndRejections (internal/process/task_queues.js:80:21) {
  code: 'ERR_INVALID_ARG_TYPE'
}
```

**原因：**

`Buffer.concat` 时，参数的类型必须时 `Buffer` 或者是 `Uint8Array`

**解决：**

```js
// ...
.on('data', (chunk) => {
  // [object Uint8Array]
  console.log(Object.prototype.toString.call(chunk));
})
```

通过尝试发现 `chunk` 传进来时的类型就是 `Uint8Array`，但是被我们转换成 `string` 存储来了。

于是修改 `server.js` 中的代码，在 `body.push` 的时候不经过处理，将 `chunk` 保存在 `body` 变量中。

```diff
.on('data', (chunk) => {
- body.push(chunk.toString());
+ body.push(chunk);
})
```
