---
layout: post
title: "JavaScript中的设计模式(3)——装饰者模式"
category: '笔记' 
tags: ['JavaScript设计模式']
cover: "/img/jspatterns/decorator-cover.jpg"
---


装饰者模式用于运行时动态为对象附加功能。对于静态语言可能比较麻烦，但对于JavaScript这样的动态语言而言，在运行时动态添加功能很容易。下面我们就来看看JavaScript中的装饰者模式吧。

<!--more-->
{% codeblock lang:javascript %}
function createDate(){
    var paramStr = ([].slice.call(arguments)).join(',');
    return eval("new Date(" + paramStr +")");
}
var x = createDate(2012, 12, 12, 1);console.log(x);
var y = createDate.apply(null, [2012, 12, 12, 1]);console.log(y);
{% endcodeblock %}


