---
layout: post
title: "JavaScript中的设计模式(3)——装饰者模式"
category: '笔记' 
tags: ['JavaScript设计模式']
cover: "/img/jspatterns/decorator-cover.jpg"
---


装饰者模式用于运行时动态为对象附加功能。对于静态语言可能比较麻烦，但对于JavaScript这样的动态语言而言，在运行时动态添加功能很容易。下面我们就来看看JavaScript中的装饰者模式吧。

<!--more-->

## 目录
+ 要解决的问题
+ 如何实现
	+ 使用继承
	+ 使用列表
+ 在开源框架和类库中的应用
+ 总结

### 要解决的问题

装饰者模式主要解决的问题就是将对象与可扩充的简单的基本单元分离出来，按需增强该对象。这种场景在生活中哪儿可以看到呢？看看下面的图：

![生活中的装饰者模式](/img/jspatterns/decorator-examples.png)

想一想，是不是RPG游戏大多都是这种模式？捡装备就是给人物装饰了新的能力或是属性，在线配置电脑就是在低配之上按需装饰更高级的软硬件和服务。简单来说，一个事物从诞生到成熟的过程，其实不也可以看作是一步步应用装饰者的过程吗？比如当年的浏览器还只能处理纯文本，而今天的高级浏览器已经支持各种富媒体和硬件传感器了。

### 如何实现

在JavaScript中实现装饰者模式有两种常见的方法：一是采用继承，二是采用装饰列表。


超级玛丽的实现：

<a class="jsbin-embed" href="http://jsbin.com/IgivUnu/1/embed?js,console">JS Bin</a><script src="http://static.jsbin.com/js/embed.js"></script>

Sale中的列表实现
<a class="jsbin-embed" href="http://jsbin.com/IbUbohU/6/embed?js,console">JS Bin</a><script src="http://static.jsbin.com/js/embed.js"></script>


{% codeblock lang:javascript %}
function createDate(){
    var paramStr = ([].slice.call(arguments)).join(',');
    return eval("new Date(" + paramStr +")");
}
var x = createDate(2012, 12, 12, 1);console.log(x);
var y = createDate.apply(null, [2012, 12, 12, 1]);console.log(y);
{% endcodeblock %}


