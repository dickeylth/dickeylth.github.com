---
layout: post
title: "JavaScript中的设计模式(2)——工厂模式"
desc: "工厂模式通常用于重复创建相似对象，提供动态创建对象的接口，在实际中的应用很多。在本文中我们来看看身边的工厂模式，以及它与构造函数的区别"
category: '笔记' 
tags: ['JavaScript设计模式']
cover: "/assets/images/jspatterns/factory-cover.jpg"
---
{% include JB/setup %}

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

{% highlight javascript %}
var o = new Object(),
    n = new Object(1),
    s = Object('1'),
    b = Object(true);

// test
o.constructor === Object;	// true
n.constructor === Number;	// true
s.constructor === String;	// true
b.constructor === Boolean;	// true
{% endhighlight %}

当然，除了工厂模式，很多时候我们也会直接采用`new`关键字调用构造函数来创建对象。那么这两种实现方式有什么区别呢？什么时候采用工厂模式，什么时候采用构造函数呢？

我们先来看看各种nodejs教程中的开篇经典demo：

{% highlight javascript %}
var http = require("http");

http.createServer(function(request, response) {
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write("Hello World");
	response.end();
}).listen(8888);
{% endhighlight %}

nodejs中的http模块输出了createServer这个接口，这里就是一个典型的工厂模式。
但看看http模块的源码，可以发现其实http同样提供了Server这个构造器接口：

{% highlight javascript %}
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
{% endhighlight %}

为啥要同时输出构造器和工厂模式两种接口呢？同样好奇的不止你我，Google一下你会发现Google group上同样有人提出了这样的问题：

+ [[nodejs] Why net.createServer() and not new net.Server()?](https://groups.google.com/forum/#!msg/nodejs/GTaCdFPlweI/M0q38C3SJpkJ)
+ [Why export both http.Server() and http.createServer()?](https://groups.google.com/forum/#!msg/nodejs/yoXogs7vNYU/uUKT59t_w-sJ)


可变参数的Date对象构造工厂：
{% highlight javascript %}
function createDate(){
    var paramStr = ([].slice.call(arguments)).join(',');
    return eval("new Date(" + paramStr +")");
}
var x = createDate(2012,12,12,1);console.log(x);
{% endhighlight %}

## 测试一下markdown 语法

### 列表

* test
* sina
* qq

### 语法高亮

{% highlight javascript %}
var a = 100;
console.log(Object.prototype.toString.call(a));
{% endhighlight %}

{% highlight ruby %}
def foo
  puts 'foo'
end
{% endhighlight %}
