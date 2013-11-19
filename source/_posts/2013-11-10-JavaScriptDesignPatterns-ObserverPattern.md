---
layout: post
title: "JavaScript中的设计模式(5)——观察者模式"
category: '笔记' 
tags: ['JavaScript设计模式']
cover: "/img/jspatterns/observer-cover.jpg"
---


观察者模式在JavaScript中的典型应用就是大家最熟悉的事件了，事件最早是在IE3和Netscape Navigator 3中出现的（此时JavaScript版本为1996年8月发布的JavaScript 1.1）。然而在前端模块化发展蓬勃的今天，原生的事件已经不足以满足复杂前端架构的要求了，自定义事件作为观察者模式的另一种应用应运而生。让我们来看看观察者模式如何让代码组织耦合度更低。

<!--more-->

## 目录
+ 要解决的问题
+ 如何实现
+ 在开源框架和类库中的应用
+ 总结

### 要解决的问题

观察者模式解决的是复杂系统中模块之间的松散耦合问题。观察者模式也叫订阅者/发布者（subscriber/publisher）模式，这个别名其实就很形象。想像一下当年订报纸的场景，订户订了某份报纸，报社每日/周发布一次报纸，订阅了该报纸的订户就会收到该报纸，然后读报。如果我们不采用观察者模式，想象一下上面的例子，当报社的发布方法比如`pubDaily()`执行后，需要遍历并执行各订户的比如说`read`方法来读报，这样一来就会导致`read`方法的调用硬编码在`pubDaily`方法中了，如果有天我们需要换一个方法或者添加方法，就需要直接修改`pubDaily`方法了，这样一来就会导致代码耦合度比较高，而且有时我们并不一定拥有修改`pubDaily`方法的权限。

生活中又有哪些观察者模式的应用呢?其实随处可见，我们在生活中无时无刻不在与各种事件打交道，当某种事件发生时我们就会作出相应的反应，看看下面的图：

![生活中的观察者模式](/img/jspatterns/observer-examples.png)

比如，路口的红绿灯，行人和车辆都需要观察灯的状态的变化等候或通过；做饭时，比如油烧开了该放葱蒜了、水烧开了该放面条了；双11来了，到了秒杀的时间点了，我们就该出手了。这些都是对象之间监听其他对象的状态执行自定义的方法的例子。

### 如何实现

当页面中模块相互相对独立，交互比较简单的时候观察者模式发挥的作用还不太明显，但是对于复杂表单的处理，尤其各模块之间存在耦合关系时，此时观察者模式就会大有用武之地了。让我们看看淘宝旅行的机票订单页：

![淘宝旅行机票订单页](/img/jspatterns/observer-flight.png)

看上去这个表单比较小清新，但是小清新的背后却对于前端架构提出了更高的要求。可以看到，仅仅是“添加一位乘机人”这个操作，就需要多个模块对其进行监听并执行相应的操作。对于这个页面的详细的前端架构的解剖可以参阅陶清的[《复杂表单应用解耦，淘宝机票订单实践》](http://ued.taobao.org/blog/?p=6366)，虽然并不是同一个页面，但新版的订单页也是基于之前国际机票订单页的基础之上进行扩展的，基础的架构都还是比较一致的。

下面让我们使用原生的JavaScript来简单模拟一下其中的注册/发布模式：

<a class="jsbin-embed" href="http://jsbin.com/AmilUmUh/1/embed?js,console">JS Bin</a><script src="http://static.jsbin.com/js/embed.js"></script>

在这里我们创建了一个`GlobalEvent`对象来对各个模块的注册/发布进行统一管理，发布者-事件类型-观察者之间构成了一个M:N:M的双重多对多的关系，即发布者和事件类型之间是多对多的关系，而事件类型与观察者之间又是多对多的关系。

![观察者与主体（被观察者）之间联系](/img/jspatterns/observer-subject.png)

对于`GlobalEvent`而言，本身并不关心发布者，它只负责在被发布者调用其`publish`方法时，查询已经注册过该发布事件类型的所有观察者，然后依次调用观察者给定的方法。

为了使我们的`GlobalEvent`更为强大，在其中还加入了对于事件分组的处理，对于`subscribe`的处理逻辑还比较简单，只是一个单纯的插入动作；但对于`unsubscribe`的处理，则需要考虑到如果观察者之前监听的是带通配符的事件，例如`passenger:*`，而只是`unsubscribe`其中一个，例如`passenger:add`，则需要从通配符事件`passenger:*`监听列表中删除该观察者的同时，为其他相关的非通配符事件如`passenger:delete`、`passenger:update`监听列表中添加该观察者。

当然，在实际的应用中我们不用这么麻烦来实现自己的pub/sub机制，在很多流行框架和库中已经为我们提供了称为“自定义事件”的API，帮助我们更方便地处理相应的场景。在后面会进一步介绍。

让我们来看看机票订单页如今的处理方法，通过利用KISSY提供的[`Event.Target`](http://docs.kissyui.com/1.4/docs/html/api/event/event-target.html)对象，将其混入普通对象，就可以使普通对象也可以像dom元素一样触发和监听自定义的事件，于是实现了一个简单的`Glbevt`模块，负责模块之间自定义事件的管理，同时在其中加入一些通用事件的处理逻辑，如模拟鼠标点选复选框事件、页面`reflow`触发等。

这样一来对于页面中其他模块，通过加载`Glbevt`模块，实现自定义事件的添加、删除和监听。我们可以简单画出下面这张结构图：

![订单页模块自定义事件管理](/img/jspatterns/observer-glbevt.png)

可以看到，各模块之间通过`Glbevt`联系起来，左边的模块使用了KISSY中的`addTarget`添加`Glbevt`到模块的冒泡事件源列表中，因而除了可以调用`Glbevt`的`on`方法监听响应全局的自定义事件外，也可以作为事件源主动`fire`出自定义事件，由`Glbevt`冒泡捕捉到然后查找`Glbevt`已注册的事件句柄响应之。

那么这个`Glbevt`内部长什么样子呢？是以什么样的结构来管理各种注册的事件的呢？我们看看下面的运行时截图：

![Glbevt运行时结构](/img/jspatterns/observer-glbevt-inner.png)

可以看到，`Glbevt`内部在`__~ks_custom_events`对象中管理了各种自定义事件，对每个自定义事件，以`observers`数组管理了注册的一些配置信息，具体里头放着什么呢？进一步展开：

![observers数组](/img/jspatterns/observer-glbevt-inner2.png)

可以看到对每个`observer`，指定了上下文对象`context`、触发后的回调函数`fn`、分组信息`groups`和事件类型`type`，这样在触发了该自定义事件时，就可以通过回调函数`fn`的闭包机制实现模块间的数据通信，如：

{% codeblock lang:javascript %}
//提交数据
Glbevt.on('confirm:getdata',
    function (evt) {
        that._savePassengers();
        evt.fn({
            name: PassengerList.NAME,
            data: {
                model: that.simpleModels(),
                adultAmount: that.countAdult()
            }
        });
    });
{% endcodeblock %}

### 在开源框架和类库中的应用

在开源框架中，YUI、jQuery和KISSY都为注册/发布机制提供了非常方便的API，如：

{% codeblock lang:javascript %}
// Publish

// jQuery: $(obj).trigger("channel", data);
$( el ).trigger( "/login", data );

// YUI: el.fire("channel", data);
el.fire( "/login", data );

// KISSY: el.fire("eventType", data )
el.fire( "/login", data );


// Subscribe

// jQuery: $(obj).on( "channel", [data], fn );
$( el ).on( "/login", function( event ){...} );

// YUI: el.on("channel", handler);
el.on( "/login", function( data ){...} );

// KISSY: el.on("channel" , fn [ , scope ] );
el.on( "/login", function( data ){...} );


// Unsubscribe

// jQuery: $(obj).off( "channel" );
$( el ).off( "/login" );

// YUI: el.detach("channel");
el.detach( "/login" );

// KISSY: el.detach("channel" [ , fn , scope ] );
el.detach( "/login" );

{% endcodeblock %}

与YUI类似，KISSY中的自定义事件也是通过[`EventTarget`](http://docs.kissyui.com/1.3/docs/html/api/core/event/event-target.html)接口实现事件触发和管理的方法，包括：

+ `on`：定义监听句柄
+ `detach`: 移除监听句柄
+ `fire`: 触发自定义事件
+ `publish`: 定义可冒泡和拥有默认函数`defaultFn`的自定义事件
+ `addTarget`/`removeTarget`： 控制事件冒泡到哪些对象




### 总结

策略模式对于有多种可提炼出较为通用的算法，并在不同的使用场景中可能会按需选择某一种或某几种策略完成对应的业务逻辑时比较有用。所以如果当你的程序中涉及到类似的一些场景，如业务逻辑涉及到分类和按需应用时，就可以考虑一下策略模式来实现算法和调用的解耦。