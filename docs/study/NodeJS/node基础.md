## node_buffer
### Buffer对象
* 创建的三种方式

  * const buf = new Buffer(size)
  * const buf = new Buffer(array)
  * const buf = new Buffer(str, [encoding])

* buf.length - 缓存区大小

* buf.fill(value, [offset], [end])

  - 初始化缓存区中的所有内容

* buf.copy(targetBuffer, [targetStart], [sourceStart], [sourceEnd])

  * 将Buffer对象中的二进制数据复制到另一个Buffer对象中
  * a.copy(b, 10) - 将a Buffer对象中的内容复制到b Buffer对象中

* 字符串与缓存

  * 区别：

    * 在Node.js中，一个字符串的长度与根据该字符串所创建的缓存区的长度并不相同
    * 字符串一旦创建后不可修改，而Buffer对象是可以被修改的
    * Buffer对象不具备字符串的常见方法，只有slice方法，并且是与原数据共享内存区域

  * 转换为字符串

    * buf.toString([encoding], [start], [end])

      * Buffer对象转换为字符串

    * StringDecoder对象

      * 适用于需要将多个Buffer对象中的二进制数据转换为文字的场合

        ```javascript
        const StringDecodr = require('string_decoder').StringDecoder
        const decoder = new StringDecoder([encoding])
        decoder.write(buffer)  //  返回转换后的字符串
        ```

  * buf.write(string, [offset], [length], [encoding])

    * 向已创建好的Buffer对象中写入字符串

* 数值对象与缓存

  * 将Buffer对象读取为Number类型数据的方法
    * buf.readUInt8(offset, [noAssert])
    * ...
  * 将Number对象转换为精确类型后向Buffer中写入
    * buf.writeUInt8(value, offset, [noAssert])
    * ...

* JSON对象与缓存

  * JSON.stringify() - 将Buffer对象转换为字符串
  * JSON.parse() - 将字符串转换为数组

* Buffer常见的类方法

  * Buffer.isBuffer(obj)
  * Buffer.byteLength(string, [encoding])
  * Buffer.concat(list, [totalLength])
    * 将几个Buffer对象结合创建为一个新的Buffer对象
  * Buffer.isEncoding(encoding)

## node_fs
### 同步异步的区别

* 大多数情况下为了防止阻塞，推荐调用异步方法，很少场景中(如读取配置文件并启动服务器)需使用同步方法
* 同时调用多个异步方法无法确保操作结果的返回顺序，如果要保障顺序就要上异步方法的回调中继续调用下一个异步方法

### 文件读取相关

#### 完整读写

* fs.readFile(filename, [options], (err, data) => {})
* fs.writeFile(filename, data, [options], (err) => {})
  * 当文件不存在时会自动创建改文件
* options 
  * flag:用于指定对该文件采取何种操作，默认值为"w"
  * mode:指定当文件被打开时对该文件的读写权限
  * encoding:属性值可以为"utf-8","ascii","base64"
* fs.appendFile(filename, data, [options], (err) => {})
  * flag属性默认为"a",表示追加数据
* 对应的同步方法

#### 指定位置读写

* fs.open(filename, flags, [mode], (err, fd) => {})
  * fd为文件描述符
* fs.read(fd, buffer, offset, length, position, (err, bytesRead, buffer) => {})
* fs.write(fd, buffer, offset, length, position, (err, written, buffer) => {})
* fs.fsync(fd, [callback])
  * 将内存缓冲区的剩余数据全部写入文件，同步之后再使用fs.close()关闭文件比较安全
* fs.close(fs, [callback])

#### 其他文件操作

* fs.truncate(filename, len, (err) => {}) 截断文件
  * fs.truncate(fd, len, (err) => {})
* fs.watchFile(filename, [options], listener)
  * options - persistent:true, interval
  * listener - (curr, prev) => {}
  * fs.unwatchFile(filename, [listener])



### 目录相关操作

* fs.mkdir(path, [mode], (err) => {})
* fs.readdir(path, (err, files) => {})
* fs.rmdir(path, (err) => {})

#### 文件目录皆可

* fs.stat(path, (err, stats) => {}) 查看文件/目录信息
  * 返回fs.Stats对象，拥有isFile(), isDirectory(), size, atime, mtime, ctime等方法与属性
  * fs.fstat(fd, (err, stats) => {})
* fs.lstat(path, (err, stats) => {}) 查看符号链接文件/目录信息
* fs.realpath(path, [cache], (err, resolvedPath) => {})
* fs.utimes(path, atime, mtime, (err) => {}) 修改访问时间与修改时间
  * fs.futimes(fd, atime, mtime, (err) => {})
* fs.chmod(path, mode, (err) => {}) 修改访问权限
  * fs.fchmod(fd, mode, (err) => {})
* fs.rename(oldPath, newPath, (err) => {})
* fs.link(srcpath, dstpath, (err) => {})
  * 创建硬链接
  * fs.unlink(path, (err) => {}) 删除硬链接
* fs.synlink(srcpath, dstpath, [type], (err) => {})
  * 创建符号链接
  * type：file、dir
  * fs.readlink(path, (err, linkString) => {})
* const watcher = fs.watch(filename, [options], [listener])
  * listener - (event, filename) => {}，当event参数值为rename或change时，filename参数值为任何发生改变的文件的完整路径及文件名。
  * 返回一个fs.FSWatcher对象，该对象拥有close方法
  * watcher.close()
    * watcher.on('change', (event, filename) => {})

### 文件流读写

* const readStream= fs.createReadStream(path, [options])
  * options
    * flags
    * encoding
    * autoClose
    * start
    * end
  * readStream.on(eventName, () => {})
    * open
    * data
    * end
    * close
    * error  (err) => {}
  * readStream.pause() 
    * 该方法可以暂停data事件的触发
  * readStream.resume()
    * 该方法可以恢复data事件的触发
  * readStream.pipe(destination, [options])
    * destination - 可用于写入流数据的对象
    * options：其中end属性，指定布尔值，如果为true，当数据被全部读取完毕时，立即将缓存区中的剩余数据全部写入文件中并关闭文件。默认为true
    * readStream.pipe(writeStream)
  * readStream.unpipe([destination])
    * 如果不设置destination，则取消所有对在pipe方法中指定的目标文件的写入操作
* const writeStream = fs.createWriteStream(path, [options])
  * options
    * flags
    * encoding
    * start: 指定文件的开始写入位置
  * writeStream.write(chunk, [encoding], [callback])
    * chunk 可以为一个Buffer对象或一个字符串，指定要写入的数据
    * 该方法会返回布尔值，当缓存区中的数据已全部写满时，该参数值为false
  * writeStream.end([chunk], [encoding], [callback])
  * writeStream.bytesWritten 为当前已在文件中写入数据的字节数
  * writeStream.on(eventName, () => {})
    * drain：当缓存区中的数据已被全部读出并写入到目标文件时，触发writeStream的drain事件，表示缓存区中的数据已全部读出，可以继续向操作系统缓存区中写入新的数据。
    * error  (err) => {}

### 路径操作PATH模块

* path.normalize(p)
* path.join()
  * path.join(__dirname, 'a', 'b', 'c')
* path.resolve()
  * 以应用程序的根目录为起点，根据所有的参数值字符串解析出一个绝对路径
* path.relative(from, to)
  * 获取两个路径之间的相对关系
* path.dirname(p)
  * 获取路径中的目录名
* path.basename(p, [text])
  * 获取路径中的文件名
* path.extname(p)
  * 获取路径中的扩展名(后缀名)
* path.sep 操作系统中的文件分隔符 eg:\\
* path.delimiter 操作系统中的路径分隔符 eg:;

## node_http&https
### HTTP服务端

* const server = http.createServer([requestListener])
  * const http = require('http')
  * requestListener - 当接收到客户端请求时触发，两种形式
    * requestListener - (req, res) => {}
    * server.on('request',  (req, res) => {})
* server.listen(port, [host], [backlog], [callback])
  * port - 指定端口号
  * host - 监听的地址
  * backlog - 指定位于等待队列中的客户端连接的最大数量，默认511
  * callback 
    * 当服务器端指定了需要监听的地址及端口后，服务端将立即监听来自于该地址及端口的客户端连接，此时触发服务器的listening事件
    * server.on('listening', () => {})
* server.close()
  * server.on('close', () => {})
* server.on('error', (err) => {})
  * err.code === 'EADDRINUSE'   端口被占用
* server.on('connection', (socket) => {})
  * 当客户端与服务器端建立连接时触发服务器端的connection事件
* server.setTimeout(msecs, (socket) => {})
  * 设置服务器端的超时时间。当超过该时间之后，客户端不可继续利用本次连接，下次请求要重新建立连接。
  * server.on('timeout', (socket) => {})
  * server.timeout属性 - 可读写

#### req - http.IncomingMessage对象

* 常用属性和事件
  * method
  * url
  * headers
  * httpVersion
  * trailers
  * socket
  * req.on('data', (data) => {})
  * req.on('end', () => {}) - 客户端请求数据已全部接收完毕
* Query String 模块 - 查询字符串的解析与转换
  * querystring.parse(str, [sep], [eq], [options]) - 转换为对象
  * querystring.stringify(obj, [sep], [eq]) - 转换为查询字符串
* url模块
  * url.parse(urlStr, [parseQueryString])
    * 解析得到一个对象，包含以下属性
      * href、protocol、slashes、host、auth、hostname、port、pathname、search、path、query、hash
  * url.format(urlObj) - 还原成URL字符串
  * url.resolve(from, to) - 结合成为一个路径

#### res - http.ServerResponse对象

* res.writeHead(statusCode, [reasonPhrase], [headers])
  * statusCode - 状态码；reasonPhrase - 对于该状态码的描述信息
  * headers - 指定服务器端创建的响应头对象：content-type, location, Cache-Control, Etag, Expires等等
* res.setHeader(name, value)
* res.getHeader(name)
* res.removeHeader(name)
  * 必须在res的write方法发送数据之前被调用
* res.headerSent
  * 响应头已发送时，该属性为true
* res.sendDate
  * 将其设置为false可以在响应头中删除Date字段
* res.statusCode
  * 当未在writeHead方法中设置状态码时，可通过该属性设置状态码
* res.addTrailers(headers)
  * 前提条件：必须现在响应头中添加过Trailer字段并且将字段值设置为追加的响应头中所指定的字段名
* res.write(chunk, [encoding])
  * 该方法返回布尔值
  * true - 数据直接发送到操作系统内核缓存区
  * false - 数据首先缓存在内存中
* res.end(chunk, [encoding])
* res.setTimeout(msecs, [callback])
  * 如果指定时间内服务器没有作出响应，响应超时，则触发res对象的timeout事件
  * res.on('timeout', () => {})
* res.on('close', () => {})
  * 在end被调用之前，连接中断，将触发res对象的close事件

### HTTP客户端

* const request = http.request(options, (response) => {})
  * options - 为一个对象或字符串，可配置的属性有
    * host、hostname、port、localAddress、socketPath、method、path、headers、auth、agent
  * 当客户端请求获取到服务器响应流，触发http.ClientRequest对象的response事件
  * request.on('response', (response) => {})
    * response参数值为一个http.IncomingMessage对象(?有点疑问，感觉是http.ServerResponse对象)
* request.write(chunk, [encoding])
* request.end([chunk], [encoding])
* request.abort()
* request.on('error', (err) => {})
* request.on('socket', (socket) => {})
  * 建立连接的过程中，当为该连接分配端口时，触发socket事件
  * socket.setTimeout(1000)
  * socket.on('timeout', () => { request.abort() })
* request.setTimeout(msecs, [callback])
  * 为连接分配的端口设置超时时间
* http.get(options, callback)
  * 与http.request的区别是不用再手动调用end方法

### HTTPS服务器

* 创建HTTPS服务器之前，首先需要创建公钥、私钥及证书，具备证书文件之后，可以利用该证书文件创建一个pfx文件
* const server = **https**.createServer(options, [requestListener])
  * const https = require('https')
  * options - 指定创建HTTPS服务器可以使用的各种选项
    * pfx, key, passphrase, cert, ca, crl, ciphers等等
  * requestListener - 当接收到客户端请求时触发，两种形式
    * requestListener - (req, res) => {}
    * server.on('request',  (req, res) => {})
* server.listen(port, [host], [backlog], [callback])
  * port - 指定端口号
  * host - 监听的地址
  * backlog - 指定位于等待队列中的客户端连接的最大数量，默认511
  * callback 
    * 当服务器端指定了需要监听的地址及端口后，服务端将立即监听来自于该地址及端口的客户端连接，此时触发服务器的listening事件
    * server.on('listening', () => {})
* server.close()
  * server.on('close', () => {})
* server.on('error', (err) => {})
  * err.code === 'EADDRINUSE'   端口被占用
* server.on('connection', (socket) => {})
  * 当客户端与服务器端建立连接时触发服务器端的connection事件
* server.setTimeout(msecs, (socket) => {})
  * 设置服务器端的超时时间。当超过该时间之后，客户端不可继续利用本次连接，下次请求要重新建立连接。
  * server.on('timeout', (socket) => {})
  * server.timeout属性 - 可读写

### HTTPS客户端

* const request = **https**.request(options, (response) => {})
  * options - 为一个对象或字符串，可配置的属性有
    * host、hostname、port、method、path、headers、auth、agent、pfx、key、passphrase、 cert、 ca、 crl、 ciphers、rejectUnauthorized
  * 当客户端请求获取到服务器响应流，触发http.ClientRequest对象的response事件
  * request.on('response', (response) => {})
* request.write(chunk, [encoding])
* request.end([chunk], [encoding])
* request.abort()
* request.on('error', (err) => {})
* request.on('socket', (socket) => {})
  * 建立连接的过程中，当为该连接分配端口时，触发socket事件
  * socket.setTimeout(1000)
  * socket.on('timeout', () => { request.abort() })
* request.setTimeout(msecs, [callback])
  * 为连接分配的端口设置超时时间
* **https**.get(options, callback)
  * 与https.request的区别是不用再手动调用end方法


## node_process
### 进程与线程的概念
* 进程
* 子进程
* 线程

### Process对象
* 含义：全局对象，代表Node.js应用程序

* 属性

  * execPath - 应用程序的可执行文件的绝对路径
  * version & versions
  * platform
  * argv - 包含了运行Node.js应用程序的所有命令行参数的一个数组
  * stdin - 可用于读入标准输入流的对象
    * process.stdin.resume() - 恢复默认情况下处于暂停状态下的标准输入流
    * process.stdin.on('data', (chunk) => { process.stdout.write('进程接收到数据' + chunk )})
  * stdout- 可用于写入标准输入流的对象
  * stderr - 可用于写入标准错误输出流的对象
  * env
  * config
  * pid - 当前Node.js应用程序的进程的PID
  * title
  * arch

* 方法&事件

  * memoryUsage() - 获取内存使用情况，返回一个对象

  * **nextTick()**

    * 用于将一个函数推迟到代码中所书写的下一个同步方法执行完毕时或异步方法的事件回调函数开始执行时调用

    * 常见使用场景

      * 指定一个函数在一个同步方法执行完毕时立即调用

        ```javascript
        const finish = () => {
          console.log('文件读取完毕！')
        }
        process.nextTick(finish)
        console.log(fs.readFileSync('./app.js').toString())
        ```

      * 可以使用nextTick指定两个耗时操作同步进行

        ```javascript
        const foo = () => {
          const beginAnotherTask = () => {
            const file = fs.createReadStream('./crash.mp3')
            file.on('data', (data) => {
              console.log('读取到%d字节。', data.length)
            })
            process.nextTick(beginAnotherTask)
          }
        }
        const file = fs.createReadStream('./crash.mp3')
        file.on('data', (data) => {
          console.log('从crash.mp3文件中读取到%d字节。', data.length)
        })
        foo();
        ```

      * process.maxTickDepth - nodeV0.10开始允许nextTick使用实现递归，但为了避免应用程序阻塞在死循环中，提供该属性，默认值1000.

    * abort() - 向运行nodejs应用程序的进程发出SIGABART信号，使进程异常中止。

    * chdir(directory) - 修改应用程序中使用的当前工作目录 

    * cwd() - 返回当前目录

    * exit([code])

    * kill(pid, [signal]) - 向一个进程发送信号

    * unmask([mask]) - 用于读取或修改运行nodejs程序的进程的文件权限掩码

    * uptime() - 当前运行时间

    * hrtime() - 测试一个代码段的运行时间

    * 可能触发的事件

      * exit - process.on('exit', () => {})
      * uncaughtException - process.on('uncaughtException', (err) => {})
      * 各种信号事件 - Example: process.on('SIGINT', () => {})



### child_process模块

* 通过child_process模块，在Node.js应用程序的主进程运行之后，可以开启多个子进程

* **child_process.spawn(command, [args], [options])**

  * 返回一个隐式创建的代表子进程的ChildProcess对象

  * command - 字符串，用于指定需要运行的命令

  * args - 数组，存放运行该命令时需要的参数

  * options - 对象，指定开启子进程时使用的选项

    * cwd - 字符串，指定子进程的当前工作目录
    * **stdio** - 字符串或三个元素的数组，设置子进程的标准输入/输出
      * 三个元素可指定的值主要包括
        * pipe - 在父子进程之间创建一个管道
        * ipc - 在父子进程间创建一个专用于传递消息或文件描述符的IPC通道
        * ignore - 指定不为子进程设置文件描述符
        * Stream - 指定子进程与父进程共享一个终端设备
        * null/undefined - 使用默认值
      * Example: child_process.spawn('prg', [], { stdio: ['pipe', 'pipe', process.stderr] })
        * stdio属性值常见值 - { stdio: 'inherit' } 
          * 'ignore' = ['ignore', 'ignore', 'ignore']
          * 'pipe' = ['pipe', 'pipe', 'pipe']
          * 'inherit' = [process.stdin, process.stdout, process.stderr]
    * env - 对象，用于以"键名/键值"的形式为子进程指定环境变量
    * **detached** - 布尔值，当设置为true时，该子进程为进程组中的领头进程(领头进程：当父进程不存在时，子进程也可独立存在)。默认值为false。
      * 默认情况下，只有在子进程全部退出后，父进程才能退出
      * 为了可以让父进程先退出
        * detached设置为true
        * 还需调用子进程对象的unref方法允许父进程退出

  * 使用示例

    ```javascript
    test1.js
    process.stdout.write('子进程当前工作目录为：'+process.cwd())
    process.argv.forEach((val, index, array) => {
      process.stdout.write('\r\n：'+index+': '+val)
    })

    test2.js
    const fs = require('fs')
    const out = fs.createWriteStream('./message.txt')
    process.stdin.on('data', (data) => {
      out.write(data)
    })
    process.stdin.on('end', (data) => {
      process.exit()
    })

    spawn方法示例
    const cp = require('child_process')
    const sp1 = cp.spawn('node', ['test1.js', 'one', 'two', 'three', 'four'], {cwd: './test'})
    const sp2 = cp.spawn('node', ['test2.js'], {stdio: 'pipe'})
    sp1.stdout.on('data', (data) => {
      console.log('子进程标准输出：'+ data)
      sp2.stdin.write(data)
      sp1.kill()
    })
    sp1.on('exit', (code, signal) => {
      if (!code) {
      	console.log('子进程退出，退出信号为：'+ signal)
      } else {
      	console.log('子进程退出，退出代码为：'+ code)
      }
      process.exit()
    })
    sp1.on('error', (err) => {
      console.log('子进程开启失败：'+ err)
      process.exit()
    })
    // 如果stdio属性有ipc，那么，当该通道关闭时，将触发子进程的对象的disconnect事件
    sp1.on('disconnect', () => {
      console.log('IPC通道被关闭')
    })
    ```

* **child_process.fork(modulePath, [args], [options])**

  * 开启一个专用于运行Node.js中的**模块文件**的子进程
    * 返回一个隐式创建的代表子进程的ChildProcess对象
      * child.send(message, [sendHandle])    // 在父进程中向子进程发送消息
        * 当子进程对象接收到消息后，触发process对象的message事件
        * process.on('message', (m, setHandle) => {})
      * child.on('message', (m,setHandle) => {})   // 在父进程中接收到子进程发送的消息，触发子进程对象的message事件
      * m - message，消息
      * sendHandle
        * 可以为执行的回调函数
        * 也可为服务器对象或socket端口对象
      * process.send(message, [sendHandle])    // 在父进程中向主进程发送消息
    * 建议不要在程序中开启大量用于Node.js模块的子进程
  * modulePath - 字符串，指定需要运行的Node.js模块文件路径及文件名
  * args - 数组
  * options - 指定开启子进程时使用的选项
    * cwd
    * env
    * encoding
    * silent - 布尔值，为false时，父子进程共享标准输入/输出；为true时，子进程使用独立的标准输入/输出
  * 使用示例
    * 父子进程间共享HTTP服务器 - 在send方法中发送服务器对象
    * 父子进程间共享socket端口对象

* **child_process.exec(command, [options], [callback])**

  * 开启一个用于运行某个命令的子进程并缓存子进程中的输出结果
    * 返回一个隐式创建的代表子进程的ChildProcess对象
    * 与spawn最大的区别是
      * spawn可以在父进程实时接收子进程输出的标准输出流/错误输出流数据，异步方法
      * exec中，父进程必须等待子进程的标准输出流/错误输出流数据全部缓存完毕后才能接收这些数据，同步方法
  * command
  * options - cwd、env、encoding、timeout、maxbuffer、killingSignal
  * callback - 指定子进程终止时调用的回调函数
    * (error, stdout, stderr) => {}

* **child_process.execFile(file, [args],  [options], [callback])**

  * 开启一个专用于运行某个**可执行文件**的子进程
  * file - 指定需要运行的可执行文件的执行文件路径及文件名
  * args - 数组
  * options - 与exec中使用的options相同
  * callback - 与exec中使用的callback相同

### cluster模块

* cluster模块允许在多个子进程中运行不同的Node.js应用程序
* cluster.fork([env])
  * 返回一个隐式创建的worker对象，代表使用fork开启的子进程运行的Node.js应用程序实例对象
  * worker对象的方法与事件
    * worker.send(message, [sendHandle])   //在父进程向子进程发送消息
      * worker.on(message, [sendHandle])
    * process.send(message, [sendHandle])  //在子进程向父进程发送消息
      * process.on('message', (m, setHandle) => {})
    * worker.kill([signal]) - 可以使用kill强制关闭该worker对应的子进程
    * worker.disconnect() - 使该子进程不再接收外部连接
    * worker.on('disconnect', () => {})
    * worker.on('online', () => {})
    * worker.on('listening', (address) => {})
    * worker.on('exit', (code, signal) => {})
    * worker.suicide - 判断子进程是自动退出(true)还是异常退出
* cluster.on('fork', (worker) => {})
  * 使用fork开启子进程时，同时触发fork事件，通过回调函数指定子进程开启时所要执行的处理。
* cluster.on('online', (worker) => {})
  * 使用fork开启新的子进程后，会向主进程发送一个反馈信息，当主进程收到该反馈信息后，触发online事件
  * fork与online的区别在于：主进程中尝试使用fork开启子进程触发fork；主进程中尝试运行子进程中的Node.js应用程序时触发online。
* cluster.on('listening', (worker, address) => {})
  * 当在子进程运行的Node.js应用程序中调用服务器的listen方法后，该服务器开始对指定地址及端口进行监听，同时触发listen事件


* cluster.setupMaster([settings])
  * 修改子进程中运行的模块文件或修改子进程中运行的Node.js应用程序的其他默认行为
  * settings - 对象
    * exec - 为子进程中运行模板文件的完整路径及文件名，默认属性值为当前正在运行的Node.js应用程序中的主模块文件的完整路径及文件名
    * args
    * silent
* cluster.settings - 存放了setupMaster中使用的settings参数对象
* cluster.isMaster - 布尔值，Node.js应用程序的实例对象运行在主进程中，值为true
* cluster.isWorker - 布尔值，Node.js应用程序的实例对象运行在子进程中，值为true
* cluster.workers - 获取所有子进程中运行的worker对象
  * cluster.worker - 当前子进程中的worker
  * cluster.worker.process - 获取当前子进程
* 当在子进程中运行服务器后，客户端请求总是先被主进程接收，然后转发给子进程中的服务器。如果在多个子进程中运行服务器，当主进程接收到客户端请求后，将自动分配给一个当前处于空闲状态的子进程。

## node_error&assert
### 错误处理 - domain

* 问题背景

  * 传统的try...catch无法捕捉异步方法中抛出的异常
  * process.on('uncaughtException', () => {})虽然可以处理异步方法中抛出的异常，但方式粗鲁，有可能产生资源、内存泄漏的问题

* const domain = domain.create()

  * 返回Domain对象

* domain.name - 读写该Domain对象的名称

* domain.on('error', (err) => {})

* domain.run(fn)

  * fn - 当该函数中触发任何错误时，将被Domain对象捕获

* domain.add(emitter) - 显式绑定

  * 隐式绑定与显式绑定
  * emitter - 既可以继承了EventEmitter类的实例对象，也可是setInterval和setTimeout返回的定时器

* domain.remove(emitter) - 取消绑定

  * 解除之后，之后实例对象触发错误将不会被Domain对象所捕获

* domain.bind(callback)

  * 绑定回调函数

  ```javascript
  fs.readFile('./test.txt',domain.bind((err, data) => {}))
  ```

* domain.intercept(callback)

  * 拦截回调函数
  * 与bind的区别：使用bind，回调函数中必须使用throw抛出该错误，而intercept则是直接拦截

* domain._stack - 查看domain堆栈中的内容

* domain.exit()

  * 将该Domain对象从堆栈中弹出，不再捕获任何错误
  * 如果在Domain对象中嵌套使用其他Domain对象，则在最外层的Domain对象的exit方法被调用后，该对象及其内部嵌套的所有Domain对象都被弹出domain堆栈，所有的Domain对象都不能再捕获任何错误

* domian.enter()

  * 将该Domain对象推入堆栈，并将该Domain对象变为当前使用的Domain对象
  * 如果在一个Domain对象监听的函数中使用另一个Domain对象的enter方法，另一个Domain对象将被推入到domain堆栈中，然后改为使用该Domain对象来捕捉第一个Domain对象所监听的函数中抛出的错误

* domain.dispose() - 销毁Domain对象

### 断言处理 - assert

* 断言处理就是书写一些判断用测试代码，**如果判断结果为假，则抛出AssertionError异常**
* 判断两个值是否相等，内部使用"==="判断
  * assert.equal(actual, expected, [message])
  * assert.notEqual(actual, expected, [message])
    * actual - 实际值
    * expected - 预期值
    * message - 自定义异常信息
* 判断两个数据是否值、类型相等
  * assert.strictEqual(actual, expected, [message])
  * assert.notStrictEqual(actual, expected, [message])
* 直接判断某个值是否为真
  * assert.ok(value, [message])
  * assert(value, [message])
* 判断两个值是否相等，深层次比较
  * assert.deepEqual(actual, expected, [message])
  * assert.notDeepEqual(actual, expected, [message])
  * 比较规则：
    * 简单类型(字符串、数值、布尔值、null与undefined) - 内部使用"==="进行判断
    * 数组 - 内部使用"==="进行判断
    * 对象 - 比较他们的属性长度和属性值
    * 缓存区对象 - 先比较长度，然后逐字节比较缓存区中的内容
* 执行一个函数中的代码并判断该函数中是否会(不会)抛出一个异常。
  * assert.throws(block, [error], [mesage])
    * 如果函数中抛出异常，则不抛出AssertionError异常
  * assert.doesNotThrow(block, [error], [mesage])
  * block - 执行的函数
  * error - 返回true或false的函数，用于控制是否抛出在第一个参数值函数中指定抛出的异常，如果返回的是false则抛出该异常

## node_crypto&zlib
### crypto

* crypto.getCiphers() - 查看Node.js中能够使用的所有加密算法。
* crypto.getHashes() - 查看Node.js中能够使用的所有散列算法。
* 私钥的拥有者可以在数据发送前先对该数据进行签名操作，签名过程中将对这段数据进行加密处理。数据的接收者可以通过公钥的使用对该签名进行解密及验证操作，**以确保这段数据是私钥的拥有者所发出原始数据且在网络的传输过程中未被修改**。

#### 散列算法

* const hash = crypto.createHash(algorithm)
  * algorithm - sha1,md5,sha256,sha512,ripemd160等
* hash.update(data, [input_encoding])
  * 创建摘要
  * data - 一个Buffer对象或者字符串
  * input_encoding - 'utf8', 'ascii', 'binary'
* hash.digest([encoding])
  * 输出摘要内容，使用了digest之后就不能再向对象中追加摘要内容，即hash这个对象后续不能再被使用
  * encoding - 'hex', 'base64', 'binary'

#### HMAC算法

* 将散列和密钥结合，阻止对签名完整性的破坏
* const hmac = crypto.createHmac(algorithm, key)
  * key - 字符串， 指定一个PEM格式的密钥
* hmac.update(data)
* hmac.digest([encoding])

#### 公钥加密

* Cipher类：加密数据
  * const cipher = crypto.createCipher(algorithm, password)
    * algorithm - blowfish, aes-256-cbc等
    * password - 指定加密时所使用的密码，二进制格式的字符串或Buffer对象
  * const cipher = crypto.createCipheriv(algorithm, password, iv)
    * iv - 指定加密时所使用的初始向量，二进制格式的字符串或Buffer对象
  * cipher.update(data, [input_encoding], [output_encoding])
    * input_encoding - 'utf8', 'ascii', 'binary'
    * output_encoding - 'hex', 'base64', 'binary'
    * 可使用update多次添加需要加密的数据，与hash和hmac不同的是，cipher的update总是返回一个被分块的数据。
      * 如果加密的数据字节数足够创建一个及以上的块，返回被加密的数据
      * 如果不足以创建一个块，加密数据将被缓存在cipher对象中
  * cipher.final([output_encoding])
    * 最终返回加密数据
* Decipher类：解密数据
  * const decipher = crypto.createDecipher(algorithm, password)
  * const decipher = crypto.createDecipheriv(algorithm, password, iv)
  * decipher.update(data, [input_encoding], [output_encoding])
  * decipher.final([output_encoding])
* Sign类：生成签名
  * const sign = crypto.createSign(algorithm)
    * algorithm - RSA-SHA256
  * sign.update(data)
  * sign.sign(private_key, [output_format])
    * private_key - 字符串，指定PEM格式的私钥
    * output_format - 'hex', 'base64', 'binary'
* Verify类：验证签名
  * const verify = crypto.createVerify(algorithm)
    * algorithm - RSA-SHA256
  * verify.update(data)
  * verify.verify(object, signature, [signature_format])
    * 返回结果为布尔值
    * object - 字符串，公钥
    * signature - 签名对象

### zlib

* 创建各种用于压缩及解压缩的对象，均为既可用于读取流数据的对象，又可用于写入流数据的对象

  * zlib.createGzip([options]) -  压缩

    * zlib.createGunzip([options]) - 解压

  * zlib.createDeflate([options]) - 压缩

    * zlib.createInflate([options]) - 解压

  * zlib.createDeflateRaw([options]) - 压缩

    * zlib.createInflateRaw([options]) - 解压

  * zlib.createUnzip([options]) - 解压

    * 即可解压Gzip的也可以解压Deflate的

  * options - 指定压缩或解压数据时所使用的选项

    * flush
    * chunkSize 
    * windowBits
    * level
    * memLevel
    * strategy

  * 压缩解压缩代码示例

    ```javascript
    const zlib = require('zlib')
    const fs = require('fs')
    // 使用Gzip对象压缩文件
    const gzip = zlib.createGzip()
    const inp = fs.createReadStream('test.txt')
    const out = fs.createWriteStream('test.txt.gz')
    inp.pipe(gzip).pipe(out)

    // 使用Gunzip对象解压缩文件
    const gunzip = zlib.createGunzip()
    const inp = fs.createReadStream('test.txt.gz')
    const out = fs.createWriteStream('test.txt')
    inp.pipe(gunzip).pipe(out)
    ```

* 各种用于压缩或解压缩数据的方法，这些方法不再使用options，使用各种默认选项

  * zlib.gzip(buf, callback)
    * zlib.gunzip(buf, callback)
    * callback - (err, buffer) => {}
      * buffer - 解压或解压缩的结果
  * zlib.deflate(buf, callback)
    * zlib.inflate(buf, callback)
  * zlib.deflateRaw(buf, callback)
    * zlib.inflateRaw(buf, callback)
  * zlib.unzip(buf, callback)a

## node_other
### dns - 查找解析域名

* dns.resolve(domain, [rrtype], callback)
  * 将域名解析为一组DNS记录
  * domain - 字符串，指定需要被解析的域名
  * rrtype - 字符串，指定需获取的记录类型，每个类型都有省略该参数的对应便捷方法
    * 'A' - dns.resolve4(domain, callback)，用于获取类型为A的DNS记录，即IPv4地址
    * 'AAAA' - dns.resolve6(domain, callback)，用于获取类型为AAAA的DNS记录，即IPv6地址
    * CNAME - dns.resolveCname(domain, callback)，获取别名记录
    * MX - dns.resolveMx(domain, callback)，获取Mx记录，即邮件交换服务器记录
    * TXT - dns.resolveTxt(domain, callback)，获取TXT记录，即为该域名附加的描述信息
    * SRV - dns.resolveSrv(domain, callback)，获取SRV记录，即服务记录
    * NS - dns.resolveNs(domain, callback)，获取NS记录，即域名服务器记录
    * PTR - PTR记录用于反向地址解析，该记录将一个域名映射为一个IPv4地址
  * callback - (err, addresses) => {} - addresses，存放获取到的DNS记录的数组
* dns.lookup(domain, [family], callback)
  * 获取第一个被发现的IPv4地址或IPv6地址
  * family - 整数值，4或6
  * callback - (err, address, family) => {}
* dns.reverse(ip, (err, domains) => {})
  * 将一个IP地址反向解析为一组与该IP地址绑定的域名
* dns模块中的各种错误代码 - err.code
  * ENODATA - DNS服务器返回一个没有数据的查询结果
  * ENOTFOUND - 未发现任何域名
  * ......

### punycode

* 将域名从地方语言所采用的各种编码转换为可用于DNS服务器的punycode编码
* punycode.encode(string) - Unicode编码->punycode编码
  * punycode.decode(string) - punycode编码->Unicode编码
* punycode.toASCII(domain) - 将Unicode格式的域名转换为punycode格式的域名
  * punycode.toUnicode(domain) 
* punycode.ucs2.encode(codePoints) - 将UCS-2编码数组转换为一个字符串
  * punycode.ucs2.decode(string)
* punycode.version - 属性值为Node.js内部使用的Punycode.js类库的版本号

### os

* 该模块中的各种方法用于获取运行应用程序的操作系统的各种信息
* os.tmpdir() - 获取操作系统中的默认的用于存放临时文件的目录
* os.endianness() - 获取CPU的字节序，返回结果可能为"BE"及"LE"
* os.hostname() - 获取计算机名
* os.type() - 获取操作系统类型
* os.platform() - 获取操作系统平台
* os.arch() - 获取CPU架构
* os.release() - 返回操作系统版本号
* os.uptime() - 返回系统的当前运行时间
* os.loadavg() - 返回存放1分钟、5分钟及15分钟的系统平均负载的数组
* os.totalmem() - 返回系统的总内存量
* os.freemem() - 返回系统的空闲内存量
* os.cpus() - 返回存放了所有CPU内核的各种信息的数组
* os.networkInterfaces() - 返回存放了系统中所有网络接口的数组
* os.EOL - 常量值为操作系统中使用的换行符

### readline

* readline模块中通过Interface对象的使用来实现逐行读取流数据的处理

* const rl = readline.createInterface(options)

  * options配置选项

    * input - 为一个可用来读取流数据的对象，指定读入数据的来源
    * output - 为一个可用来写入流数据的对象，指定数据的输出目标
    * completer - 为一个函数，指定Tab补全处理

    ```javascript
    const readline = require('readline')
    const completer = () => {
      const completions = 'help error quit aaa bbb ccc'.split(' ')
      const hits = completions.filter((c) => c.indexOf(line) === 0)
      return [hits, line]
    }
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      completer
    })
    rl.on('line', (line) => {
      if (line === 'exit' || line === 'quit' || line === 'q') {
        rl.close()
      } else {
        console.log('您输入了：'+line)
      }
    })
    ```

    * terminal - 布尔类型属性

    ```javascript
    const readline = require('readline')
    const fs = reuqire('fs')
    const file = fs.createReadStream('./message.txt')
    const out = fs.createReadStream('./anotherMessage.txt')
    let index = 1
    out.write('line' + index.toString() + ':')
    index += 1
    const rl = readline.createInterface({
      input: file,
      output: out,
      terminal: true
    })
    rl.on('line', (line) => {
      out.write('line' + index.toString() + ':')
      index += 1
    })
    ```

  * rl.on('line', (line) => {})

    * 将Interface对象读取到一个"\n"字符时，表示该行数据读取结束，触发该对象的line事件。

  * rl.on('close', () => {})

    * 以下几种情况发生将触发Interface对象的close事件
      * 调用Interface对象的close方法
      * Interface对象的input属性值对象的end事件被触发
      * Interface对象接收到一个EOT信号
      * Interface对象接收到一个SIGINT信号

  * rl.pause() & rl.resume()

  * rl.write(data, [key])

    * 可以向options参数对象的output属性值目标对象中写入一些数据
    * key - 一个对象，用于在终端环境中模拟一个按键操作，例如{ctrl: true. name: 'u'}
    * rl.removeAllListeners('line') - 移除该对象的line事件回调函数

  * rl.setPrompt(prompt, [length])

    * 用于在终端环境下定制一个命令提示符，通常与rl.prompt()配合使用
    * rl.prompt() - 在一个新行中显示命令提示符

  * rl.question(query, (answer) => {})

  * 信号事件

    * 当options中的input属性值对象接收到一个信号时，将触发Interface对象的信号事件

### util

* util.format(format, [...]) - 返回经过格式化处理的字符串

  * format - 格式化字符串(%s,%d,%j,%%)
  * [...] - 其他需格式化的参数值

* 以下四个方法均为同步方法，会阻塞当前线程

  * util.debug(string)  - 将一个字符串作为标准错误输出流进行输出
  * util.error([...])  - 将一个数组中的多个字符串作为标准错误输出流进行输出
  * util.log(string) - 将一个字符串作为标准输出流进行输出，会在输出该字符串之前输出系统当前时间
  * util.puts([...]) & util.print([...])
    * 将一个数组中的多个字符串作为标准输出流进行输出

* **util.inspect(object, [options])**

  * 返回一个包含该对象信息的字符串

  * object - 指定需要被查看的信息的对象

  * options - 指定查看对象信息时所使用的各种选项

    * showHidden - 布尔类型，当该值为true时，对象信息中包含该对象的不可枚举的属性及属性值
    * depth - 整数，当查看的对象信息具有阶层关系时，该属性值指定被查看的对象信息的深度
    * colors - 布尔类型，为true时，在输出该对象信息是将对该对象的各种属性值应用各种颜色
    * customInspect - 布尔类型，为true时，在查看对象信息时将调用对于被查看信息对象自定义的Inspect方法

  * 可使用util.inspect.styles与util.inspect.colors对象来定义属性值的各种颜色或字体

    ```javascript
    util.inspect.styles.string = 'red'
    console.log(util.inspect(parent, {showHidden: true, depth: 3, colors: true}))
    ```

* util.isArray(object)

* util.isRegExp(object)

* util.isDate(object)

* util.isError(object)

* util.inherits(constructor, superConstructor)

  * 该方法将一个父类的方法继承给该父类的子类

### vm

* vm模块中提供了两个用于运行JavaScript脚本代码的方法
  * vm.runInThisContext(code, [filename])
  * vm.runInNewContext(code, [sandbox], [filename])
    * sandbox - 对象，用于指定独立的上下文环境
  * const context = vm.createContext([initSandbox])
    * 为了维护一个独立的上下文环境中的初始状态，提供了createContext方法
    * vm.runInContext(code, context)
* 创建并使用Script对象
  * const script = vm.createScript(code, [filename])
    * 编译一段代码但是不运行该代码
    * 运行的方法
      * script.runInThisContext()
      * script.runInNewContext([sandbox])

### repl.start - 自定义运行环境

* repl.start(options)
  * 返回一个REPL运行环境的实例对象
  * options中的选项包括
    * prompt - 用于修改REPL运行环境中的命令提示符
    * input - 默认选项process.stdin，指定需要用来读入流数据的对象
    * output - 默认选项process.stdout，指定需要用来写入输出流数据的对象
    * terminal - 布尔类型
    * writer - 函数，指定在输出表达式运行结果时用于格式化运行结果以及对运行结果使用各种颜色的函数
    * useColors - 布尔类型，用于指定在使用默认的writer属性值，即util.inspect方法输出表达式的执行结果时是否使用颜色
    * useGlobal - 布尔类型，默认值false，值为false时开启一个独立的上下文运行环境并且在该运行环境中运行所有代码，这些代码不可访问当运行环境开启之后开发者在全局作用域中定义的的变量值或对象
    * eval - 函数，指定对输入表达式的执行方法
    * ignoreUndefined - 布尔类型，为true时，如果表达式的执行结果为undefined,则REPL运行环境中不再显示该执行结果

