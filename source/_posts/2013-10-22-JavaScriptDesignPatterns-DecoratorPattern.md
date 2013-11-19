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

在JavaScript中实现装饰者模式有两种常见的方法：一是采用继承，二是采用装饰列表。虽然这两种方法都可以实现装饰者模式，但是实现上和调用上都存在差异。下面，以超级马里奥为例，分别就两种实现方式分别展开演示预期效果。

#### 使用继承

使用继承的预期效果如下：

{% codeblock lang:javascript %}
var superMario = new SuperMario();
superMario = superMario.decorate('mushroom');
console.log("吃了红蘑菇，超级玛丽变身了，长到" + superMario.getHeight() + "了， 血变成" + superMario.getBlood() + "滴了"); // "吃了红蘑菇，超级玛丽变身了，长到20了， 血变成1滴了"

superMario = superMario.decorate('flower');
console.log("吃了火力花，再次华丽变身，变成" + superMario.getColor() + "了，能战斗了：" + superMario.attack());   // "吃了火力花，再次华丽变身，变成white了，能战斗了：超级玛丽吐火力弹！"

superMario = superMario.undecorate2('mushroom');
console.log("超级玛丽中枪了。。。红蘑菇失效了，身高：" + superMario.getHeight() + ", 还剩" + superMario.getBlood() + "滴血，颜色：" + superMario.getColor());   // "超级玛丽中枪了。。。红蘑菇失效了，身高：10, 还剩0滴血，颜色：white"
console.log("还能战斗吗：" + (typeof superMario.attack == 'function'));   // "还能战斗吗：true"

superMario = superMario.undecorate2('flower');
console.log("超级玛丽中枪了。。。火力花也失效了，身高：" + superMario.getHeight() + ", 还剩" + superMario.getBlood() + "滴血，颜色：" + superMario.getColor());  // "超级玛丽中枪了。。。火力花也失效了，身高：10, 还剩0滴血，颜色：green"
console.log("还能战斗吗：" + (typeof superMario.attack == 'function'));   // "还能战斗吗：false"
{% endcodeblock %}

使用继承的主要原理就是将每个装饰者包装为一个对象，使原始的对象在`decorate`时不断添加继承对象，形成一长串的继承链，并对于装饰者中需要重写之前继承者的方法，每次处理时先获得上一级装饰者的返回值，再基于此返回值基础上返回本装饰者处理后的值。

以下是简单的模拟超级马里奥的实现：

<a class="jsbin-embed" href="http://jsbin.com/IgivUnu/10/embed?js,console">JS Bin</a><script src="http://static.jsbin.com/js/embed.js"></script>

当然我们还可以把装饰方法抽离出来，这样对于其他的“类”，也可以很容易实现装饰：

<a class="jsbin-embed" href="http://jsbin.com/ArIQali/9/embed?js,console">JS Bin</a><script src="http://static.jsbin.com/js/embed.js"></script>

这里`decorate`的逻辑还比较好理解，无非就是构造内部对象，添加继承链指针。但如果需要支持`undecorate`，就会稍微复杂一些了，我们先看看`decorate`所有的装饰者后的SuperMario长什么样子：

![装饰后的SuperMario](/img/jspatterns/decorator-inherit.png)

要实现`undecorate`，就需要在`decorate`时维护装饰者列表了，因为`decorate`时只保留了对前面的装饰者的指针，并没有反向的指针，就像一个单向的单链表一样。当然，它又不完全像单链表，因为各装饰者包装的对象之间又有继承链的关系，如果要插入或删除装饰者，并不是说简单地将自定义的指针`parent`按照单链表中的处理方法改变一下指向就算完了，还必须考虑到构造函数和`prototype`，这一点就比较复杂了。

在例子中给出了两种`undecorate`的实现，一种是基于操作`__proto__`隐含属性来做的，用到了ES6中才会支持的[`Object.getPrototypeof`](https://developer.mozilla.org/zh-CN/docs/JavaScript/Reference/Global_Objects/Object/getPrototypeOf)和[`Object.setPrototypeof`](https://developer.mozilla.org/zh-CN/docs/JavaScript/Reference/Global_Objects/Object/setPrototypeOf)，关于这两者以及`__proto__`的相关信息可以在两个链接中查看；另一种则是手工合并被`undecorate`掉的装饰者和上一级的装饰者到一个新的装饰者对象，然后再把断开的继承链修复起来。

#### 使用列表

使用列表的方式相对来说要容易一些，代码也更为清晰简洁，当然由于不像继承中子类可以自动沿继承链调用父类方法，因而在调用被装饰后的方法时就需要手工来完成这一步的操作，所以看上去调用起来没有使用继承时那么自然：

{% codeblock lang:javascript %}
var superMario = new SuperMario();
superMario.decorate({name: 'mushroom'});
superMario.decorate({name: 'flower'});
console.log(superMario.getDecorated({'field':'color'}));
console.log(superMario.getDecorated({'method':'attack'}));

superMario.undecorate({name: 'flower'});
console.log(superMario.getDecorated({'field':'color'}));
console.log(superMario.getDecorated({'method':'attack'}));
{% endcodeblock %}

当然这里的`decorate`方法传入的是一个option对象，为的是可以支持指定需要装饰的装饰者的某些方法而非所有，当不指定methods就默认为需要装饰所有方法。

下面是基于列表的超级马里奥的实现：

<a class="jsbin-embed" href="http://jsbin.com/oGexaci/9/embed?js,console">JS Bin</a><script src="http://static.jsbin.com/js/embed.js"></script>

之所以提供的是getDecorated方法，是为了满足多种装饰者方法的调用。当然如果像《JavaScript模式》当中的例子那样比较简单化，只有一个`getPrice()`方法需要装饰，就比如Apple或Dell的网上配置电脑的页面上，所有的装饰者最终只是影响价格一个因素的话，那么代码就可以如书中那样简洁了。

当然也可以实现如继承中的自然的调用方式，这就需要在`decorate`方法中多做一些工作了，而不是像现在这样仅仅是简单地将需要装饰的新装饰者添加到映射对象中。当然，同时也意味着`undecorate`方法不会像现在这样简单地删除掉需要删除的装饰者的key就完了。具体实现大家可以自己试试看。最后也许你会发现就会跟使用继承比较类似了。

### 在开源框架和类库中的应用

装饰者模式在开源框架和类库中同样应用很广泛，拿大家最熟悉的jQuery来说，当我们开发一个jQuery的插件时，往往会这么写：

{% codeblock lang:javascript %}
(function($) {     
$.fn.pluginName = function() {   
     // Our plugin implementation code goes here.   
};   
})(jQuery);
{% endcodeblock %}

这不就是在jQuery的原型上装饰上我们的自定义插件？从而其他jQuery对象都可以共享到该插件。

同样在KISSY中，我们看看KISSY中的[`node.js`](https://github.com/dickeylth/kissy/blob/master/src/node/src/node.js)：

{% codeblock lang:javascript %}
/**
 * @ignore
 * node
 * @author yiminghe@gmail.com
 */
KISSY.add('node', function (S, Node) {
    S.mix(S, {
        Node: Node,
        NodeList: Node,
        one: Node.one,
        all: Node.all
    });
    return Node;
}, {
    requires: [
        'node/base',
        'node/attach',
        'node/override',
        'node/anim'
    ]
});
{% endcodeblock %}

其实S.mix方法就是一个典型的装饰者模式，在已有的`S`上直接挂载上新的方法，这种方式也叫做“混元/参元”。其实装饰者模式也可以简单看作不需要通过继承而将其他对象的方法直接复制过来，这其实也是设计模式中很重要的一条原则：尽量多用组合代替继承，从而实现更为灵活的模块间组织关系。

### 总结

装饰者模式其实有点像我们今天的U盘，支持的是“可插拔”的设计，当运行时需要增加某种功能就装配上某种装饰者，不需要时就卸掉，从而实现对象的动态扩展能力。当你的业务逻辑可以抽象为这种关系时，不妨尝试一下这种设计模式的应用。