---
layout: post
title: "JavaScript 中返回自增计数的函数"
category: '笔记' 
tags: ['JavaScript']
cover: "/img/jspatterns/decorator-cover.jpg"
---

今天在写工具的时候遇到一个问题，需要生成一个带上自增计数作为后缀的字符串，简单说就是写一个比如 `function getId()` 这样的函数，每次调用返回一个从 0 开始自增的计数，当然除了这个函数，我们不希望有任何其他的全局变量。

<!-- more -->

### v0.0.1

首先当然考虑用闭包，参考[单例模式的实现](http://dickeylth.github.io/2013/10/11/JavaScriptDesignPatterns-SingletonPattern/#more)，我们可以写出下面的代码：

<a class="jsbin-embed" href="http://jsbin.com/yufol/1/embed?js,console">JS Bin</a><script src="http://static.jsbin.com/js/embed.js"></script>

这段代码可以如我们期望地那样工作，也很简单，然而还有一点不完美，函数体内再次用到了 `getId` 这个函数名，下次我们如果要改函数名，还需要改内部的名字了。

### v0.0.2

要解决上面的问题，你一定会想到 `arguments.callee` 了。是的，从 `arguments.callee` 就可以拿到函数指针了，但是下面的代码可是行不通的哟！

<a class="jsbin-embed" href="http://jsbin.com/yufol/2/embed?js,console">JS Bin</a><script src="http://static.jsbin.com/js/embed.js"></script>

当然上面的代码会报错的原因是[ `arguments.callee` 在 ES 5 严格模式中被禁用](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/arguments/callee)。

但即使我们去掉了 `use strict`，上面的代码依然不会如我们所设想的那样执行，原因是即使我们改掉了 `arguments.callee` 指向了新的函数，`getId` 这个对象依然指向的是老的函数，所以并不会生效。

不过没关系，虽然修改函数指针没有用，我们还可以借助函数名，也就是 `arguments.callee.name`：

<a class="jsbin-embed" href="http://jsbin.com/yufol/3/embed?js,console">JS Bin</a><script src="http://static.jsbin.com/js/embed.js"></script>

这样就可以将函数体与函数名解耦了。

### 但还有问题

很遗憾的是，上面的 v0.0.2 版本解法在 ES 5 严格模式下依然会报错，**在 ES 5 严格模式下不仅 `arguments.callee()` 的调用被禁用了，甚至 `arguments` 对象的 `caller`、`callee` 属性的访问都被禁用掉了**，所以考虑到渐进增强的话，我们还是需要回到 v0.0.1。

另外对于 v0.0.2，如果我们的这个函数是挂载在一个对象上，例如 `util.getId`，写法上就需要注意了：

<a class="jsbin-embed" href="http://jsbin.com/yufol/6/embed?js,console">JS Bin</a><script src="http://static.jsbin.com/js/embed.js"></script>
	
这样书写是有问题的，问题出在哪儿？

出在 `getId` 其实指向了一个匿名函数，函数体内的 `arguments.callee.name` 为空字符串，有兴趣的话你可以打印出来看看。

所以如果要在这种情况下保证一切正常工作的话，我们需要给这个匿名函数指定函数名，怎么指定？

<a class="jsbin-embed" href="http://jsbin.com/yufol/7/embed?js,console">JS Bin</a><script src="http://static.jsbin.com/js/embed.js"></script>

### v0.0.3

这一次，我们不再考虑 `arguments.callee`，仅仅使用 JavaScript 世界里的一等公民函数来创建闭包来解决试试，通过即时函数创建闭包，返回一个自增的值，于是就有了 v0.0.3：

<a class="jsbin-embed" href="http://jsbin.com/yufol/8/embed?js,console">JS Bin</a><script src="http://static.jsbin.com/js/embed.js"></script>

这样一来既不会与 `arguments` 对象打交道，也不会与 `this` 发生关系，即使挂载到别的对象上作为辅助函数也无需任何额外代码。


OK，通过这么一个简单的问题，我们就温习了闭包、单例模式、`arguments.callee`等知识点。如果你知道更好的解决办法，也期待你的回复！