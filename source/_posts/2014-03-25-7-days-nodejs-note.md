---
layout: post
title: "《七天学会NodeJS》学习笔记"
category: '笔记' 
tags: ['Node.js']
cover: "/img/jspatterns/observer-cover.jpg"
---

最近学习了阿里巴巴B2B国际站前端组推出的这篇[《七天学会NodeJS》](http://nqdeng.github.io/7-days-nodejs)长文，对Node.js里的一些基本概念和实现方式有了进一步了解，尤其其中关于进程和异步的部分值得好好研究，这里记录一下学习笔记。

<!--more-->

## Node学习笔记

### 命令行程序

#### Linux下：

1. 模块头部：`#! /usr/bin/env node`，`#!`指定当前脚本所用解析器，
2. 模块入口文件执行权限：`$ chmod +x xxx.js`
3. 链到PATH环境变量：

	`$ sudo ln -s 入口文件全路径 /usr/local/bin/期望的命令名`

#### Windows下：

依赖`.cmd`文件，与入口文件同名，同在环境变量下

`@node "C:\User\user\bin\node-echo.js" %*`

### 安装命令行程序

参数中的`-g`表示全局安装，因此node-echo会默认安装到以下位置，**并且NPM会自动创建好Linux系统下需要的软链文件或Windows系统下需要的`.cmd`文件**。

	- /usr/local/               # Linux系统下
    	- lib/node_modules/
        	+ node-echo/
        	...
    	- bin/
        	node-echo
        	...
    	...

	- %APPDATA%\npm\            # Windows系统下
    	- node_modules\
        	+ node-echo\
        	...
    	node-echo.cmd
    	...
    	
    	
### npm常用命令

- 使用`npm help <command>`可查看某条命令的详细帮助，例如`npm help install`。
- 在
`package.json`所在目录下使用`npm install . -g`可先在本地安装当前命令行程序，可用于发布前的本地测试。
- 使用`npm unpublish <package>@<version>`可以撤销发布自己发布过的某个版本代码。

### 文件操作

#### APIs

- Buffer
	- `.length`, `[index]`
	- `buffer.toString('charset')` <=> `new Buffer('string', 'charset')`
	- 与String不同，可修改，`.slice(index)`返回`buffer[index]`的引用（指针）
	- `src.copy(dest)`，先申请内存`new Buffer(length)`
	
- Stream
	- 数据量超出内存处理范围/边读取边处理
	- 基于事件，继承`EventEmitter`
		- `data`
		- `drain`判断何时只写数据流已将缓存中的数据写入目标
		- `end`
	- 大文件拷贝，`.pipe()`

- File System
	- 属性/内容读写、底层文件操作
	- 异步：
	
			fs.readFile(pathname, function(err, data))
			
	- 同步：
	
			try{
				var data = fs.readFileSync(pathname);
			}
			catch(err){
			}
		
- Path
	- `.normalize()`，转为标准路径，注意Windows下斜杠（\）和Linux下斜杠（/），兼容处理：`.replace(/\\/g, '/')`
	- `.join()`，拼接多个路径为标准路径
	- `.extname()`，获取文件扩展名

#### 文件编码

- 常见的编码：
	- 无BOM头UTF-8
	- 有BOM头UTF-8：[0xEF, OxBB, 0xBF, ...]
	- GBK，转UTF-8：`iconv-lite`->`iconv.decode(binary, 'utf-8')`
- 单字节编码（仅需处理ASCII 0~128范围内字符时适用，更简单）
	- Node自带的`binary`编码
	
### 网络操作

#### APIs

- http
	- 创建服务器/客户端
	- `request`
	- `response`
- https
	- 
		`options`: 
			{
				`key`: fs.readFileSync(keypath),
				`cert`: fs.readFileSync(certpath)
			}
			
	- 多域名服务：`server.addContext(domain, options)`
	- `rejectUnauthorized: false`，禁用证书有效性检查
- URL
	- 解析、生成、拼接url
		- `[protocol]://[auth@][hostname][:port][pathname][?query][#hash]`
	- `.parse(url[, parseQueryString, slashesDenoteHost])`，url不必要完整
		- `parseQueryString`，是否将解析结果转为对象
		- `slashesDenoteHost`，是否支持`protocol`不存在的url
	- `.format(urlObj)`
	- `.resolve(pathname, pathname2, ...)`
- Query String
	- 参数字符串（query部分）的转换
	- `.parse(queryString)`
	- `.stringify(queryObj)`
- Zlib
	- 数据压缩和解压，减少使用HTTP协议时的数据传输量
	- 压缩
	
			zlib.gzip(data, function (err, data) {
            	response.writeHead(200, {
                	'Content-Type': 'text/plain',
                	'Content-Encoding': 'gzip'
            	});
            	response.end(data);
        	});
    - 解压
    	
    		zlib.gunzip(body, function (err, data) {
                console.log(data.toString());
            });
            
- Net
	- 创建Socket服务器/客户端，对HTTP协议做底层操作
	- 服务器
	
			net.createServer(functon (connection) {
				connection.on('data', function(data) {
					connection.write(...);
				});
			});
	- 客户端
	
			var client = net.connect(options, function() {
				client.write(...);
			});
			client.on('data', function (data) {
				...
			});
			
#### 需要注意的坑

- `headers`里全转为小写，非驼峰
- `Content-Length`不确定时，`Transfer-Encoding: chunked`，反之不使用`chunked`传输方式
- 全局客户端默认只允许**5**个并发Socket连接，超出时就会`socket hang up`，解决办法：`http.globalAgent.maxSockets`

### 进程管理

- 子进程
	- `child_process.exec()`
- APIs
	- Process
		- 全局`process`对象
		- `process.argv`获取命令行参数，需要`.slice(2)`
		- `process.exit(statusCode)`
		- `process.stdin`
			- `setEncoding()`
			- `read()`
			- `resume()`
			- `on('readable, function(chunk) {})`
			- `on('end', fn)`
		- `process.stdout`
		- `process.stderr`
	- Child Process
		- `.spawn()`
			- `child_process.spawn(exec, [args], {options})`
	- Cluster
		- 多核CPU充分利用
- 进程间通信
	- Parent:
		- `child.kill('EVENT_SIGNAL')`
	- Child:
		- `process.on('EVENT_SIGNAL', function() {...});`
		- EVENT_SIGNALS: [`SIGUSR1`, `SIGTERM`, `SIGPIPE`, `SIGHUP`, `SIGINT`, `SIGBREAK`, `SIGWINCH`, `SIGKILL`, `SIGSTOP`]
	- IPC:
		- `var child = child_process.spawn('node', [ 'child.js' ], {stdio: [ 0, 1, 2, 'ipc' ]}); `
		- `child.on('message', fn)` <-> `process.send(msg)`
		- 数据在传递过程中，会先在发送端使用JSON.stringify方法序列化，再在接收端使用JSON.parse方法反序列化。**所以传输的数据必须是可JSON序列化的！**
- 子进程守护
	- `child.on('exit', function(){spawn('child.js')})`
	
### 异步编程

- 同步 vs. 异步
	- 函数返回值：输出->输入 :: 回调函数传递
	- 遍历数组：`for`循环 :: async回调处理下一个，处理完毕后回调触发后续代码执行
	- 异常处理：`try..catch` :: *由于异步函数会打断代码执行路径，异步函数执行过程中以及执行之后产生的异常冒泡到执行路径被打断的位置时，如果一直没有遇到try语句，就作为一个全局异常抛出。*
		- >在NodeJS中，几乎所有异步API都按照以上方式设计，回调函数中第一个参数都是err。因此我们在编写自己的异步函数时，也可以按照这种方式来处理异常，与NodeJS的设计风格保持一致。
- `domain`模块
	- 创建子域（JS子运行环境）
		- `domain.create()`
		- domain实例：
			- `d.run(fn);`
			- `d.on('error', fn);`
	- *NodeJS官方文档里都强烈建议处理完异常后立即重启程序，而不是让程序继续运行。*