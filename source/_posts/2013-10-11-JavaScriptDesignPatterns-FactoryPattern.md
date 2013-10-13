---
layout: post
title: "JavaScript中的设计模式(2)——工厂模式"
desc: "工厂模式通常用于重复创建相似对象，提供动态创建对象的接口。我们来看看身边的工厂模式，以及它与构造函数的区别。"
category: '笔记' 
tags: ['JavaScript设计模式']
cover: "/assets/images/jspatterns/factory-cover.jpg"
---


工厂模式通常用于重复创建相似对象，提供动态创建对象的接口。我们来看看身边的工厂模式，以及它与构造函数的区别。

<!--more-->
工厂模式作为设计模式中构造模式之一，通常在类或类的静态方法中应用，主要为了实现：

+ 重复创建相似对象
+ 根据类型名在运行时动态创建对象

拿生活中的例子来看吧，会容易理解得多。

![麦当劳汉堡](/assets/images/jspatterns/factory1.jpeg)

麦当劳的汉堡就是个最常见而贴切的例子，虽然各种汉堡名字不一，但是大体上都是相似的，都离不开上下两层的面包，区别在于中间的馅料，流水线上生产汉堡的过程不就对应重复创建相似对象？顾客到店点餐，根据点的汉堡名，后台按需生产对应的汉堡，这不就是根据类型名动态创建对象？

同样类似的还有酒店订房：

![酒店订房间](/assets/images/jspatterns/factory2.jpeg)

是不是感觉到工厂模式其实无处不在？

回到代码的世界，其实JavaScript中的工厂模式也很常见，比如JavaScript中内置的对象工厂：

{% codeblock lang:javascript %}
var o = new Object(),
    n = new Object(1),
    s = Object('1'),
    b = Object(true);

// test
o.constructor === Object;	// true
n.constructor === Number;	// true
s.constructor === String;	// true
b.constructor === Boolean;	// true
{% endcodeblock %}

当然，除了工厂模式，很多时候我们也会直接采用`new`关键字调用构造函数来创建对象。那么这两种实现方式有什么区别呢？什么时候采用工厂模式，什么时候采用构造函数呢？

我们先来看看各种nodejs教程中的开篇经典demo：

{% codeblock lang:javascript %}
var http = require("http");

http.createServer(function(request, response) {
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write("Hello World");
	response.end();
}).listen(8888);
{% endcodeblock %}

nodejs中的http模块输出了createServer这个接口，这里就是一个典型的工厂模式。
但看看http模块的源码，可以发现其实http同样提供了Server这个构造器接口：

{% codeblock lang:javascript %}
function Server(requestListener) {
	if (!(this instanceof Server)) return new Server(requestListener);
	net.Server.call(this, { allowHalfOpen: true });
	......
}
util.inherits(Server, net.Server);

exports.Server = Server;

exports.createServer = function(requestListener) {
	return new Server(requestListener);
};
{% endcodeblock %}

为啥要同时输出构造器和工厂模式两种接口呢？同样好奇的不止你我，Google一下你会发现Google group上同样有人提出了这样的问题：

+ [[nodejs] Why net.createServer() and not new net.Server()?](https://groups.google.com/forum/#!msg/nodejs/GTaCdFPlweI/M0q38C3SJpkJ)
+ [Why export both http.Server() and http.createServer()?](https://groups.google.com/forum/#!msg/nodejs/yoXogs7vNYU/uUKT59t_w-sJ)

得到的答案大意是当年受限于C++代码中的限制只好采用了这些工厂方法("Due to the way I structured the C++ stuff constructors couldn't take arguments."这句比较含糊，没说明具体原因)。

而同时提供构造器方法，Bryce猜测是为了方便以后做类型检测。

此外，让我们对比下下面两行代码：

{% codeblock lang:javascript %}
s = require("http").createServer([listener]);
s = new (require("http").Server)([listener]);
{% endcodeblock %}

很显然，上面一行代码采用链式调用的方式，可读性更强。

此外回复中还提到了Isaac解释了他为什么更倾向于不要使用`new`关键字：调用时容易漏掉这个关键字，导致直接调用构造器会污染全局变量。

尽管个人感觉这个理由不够充分，不过这让我想起了之前写的`RichDate`模块中碰到过的一个问题：如何根据可变参数列表自动构建Date对象？众所周知，JavaScript中的`Date`构造函数本身支持可变参数：

{% codeblock lang:javascript %}
new Date(2012).toLocaleString(); 				
// "1970年1月1日 上午8:00:02"

new Date(2012, 1).toLocaleString();
// "2012年2月1日 上午12:00:00"

new Date(2012, 1, 1).toLocaleString();
// "2012年2月1日 上午12:00:00"

new Date(2012, 1, 1, 1).toLocaleString();
// "2012年2月1日 上午1:00:00"

new Date(2012, 1, 1, 1, 1).toLocaleString();
// "2012年2月1日 上午1:01:00"

new Date(2012, 1, 1, 1, 1, 1).toLocaleString();
// "2012年2月1日 上午1:01:01"
{% endcodeblock %}

当然第一行有点小意外，`new Date()`只传入一个参数时自动解析为时间戳（毫秒）了。这个之后我们可以单独处理。

很遗憾`new Date()`支持的传入参数格式有限，而且会有兼容性问题。现在如果我们需要写这样一个函数：
{% codeblock lang:javascript %}
/** 
 * 解析日期字符串，自动创建对应Date对象
 * @param str 日期字符串
 * @return Date object
 */
function parseDate(str){
	
}
{% endcodeblock %}
约定输入的字符串是按照"年-月-日-时-分-秒"的字段顺序指定时间，但是未必包含所有的字段。

很容易想到利用正则过滤出各个字段：
{% codeblock lang:javascript %}
/* 
 * 解析日期字符串，自动创建对应Date对象
 * @param String str 日期字符串
 * @return Date object
 */
function parseDate(str){
	// native parse, with help from native Date constructor
    var result = new Date(str);
    if(!(result instanceof Date) || isNaN(result.getTime())){

		// split numbers from string
        var timeArr = str.match(/\d+/g);

		// TODO
		var toDate = createDate.apply(null, timeArr);
	}
}
{% endcodeblock %}

这时我们就碰到一个问题了，Date的构造函数虽然支持可变参数，但是**构造函数并不能直接通过call或者apply的方式传入参数数组来调用**。这时我们就可以看到构造器和工厂的最大区别了。

当然在Java等静态语言中调用其他对象或类的方法，提供了一种反射机制。这时工厂模式的优势可以体现得更好：动态根据指定的类名创建对应的对象。虽然这在JavaScript这样的动态语言中是不值一提的事。

那么这个包装`Date`构造函数的工厂`createDate`怎么写呢？直接根据参数数量执行对应的`Date`构造函数显然比较丑陋，借助eval，可以得到比较简单的写法：


{% codeblock lang:javascript %}
/* 
 * 根据日期数组
 * @param number 可变参数，多个数字
 * @return Date object
 */
function createDate(){
    var paramStr = ([].slice.call(arguments)).join(',');
    return eval("new Date(" + paramStr +")");
}
var x = createDate(2012, 12, 12, 1);console.log(x);
var y = createDate.apply(null, [2012, 12, 12, 1]);console.log(y);
{% endcodeblock %}

可见，这个工厂既可以按普通方式传参调用，也可以通过apply传入参数数组来调用。通过上面这些探讨，我们可以更深入地理解构造函数与工厂模式的差异。


