---
layout: post
title: "JavaScript中的设计模式(1)——单例模式"
category: '笔记'
tags: ['JavaScript设计模式']
cover: "/img/jspatterns/factory-cover.jpg"
---

最近开始系统学习设计模式，虽然以前偶尔有接触，但总感觉不够系统，正好需要做这方面的分享，遂决定来系统学习和记录一下。

<!--more-->

设计模式是程序设计中老生常谈的话题了，简单说就是针对某些可抽象为类似问题的通用的解决方案。虽然方案的思路是死的，但在不同语言中的实现由于语言间的特性会有些差异，尤其对于像JavaScript这样的动态语言而言，可能某些设计模式实现起来相比静态语言更为灵活。

当然，除了提供通用的解决方案，个人感觉更重要的是设计模式的出现提供了各种模块解耦的思路，为什么需要模块解耦？因为大多数时候我们不太可能总是推倒从来，而往往是在现有的系统基础之上做进一步的优化完善，系统中模块之间的耦合度越低，可扩展性就会越强，从而可以支撑更为复杂的业务场景和需求。另外，设计模式也是为了应对驾驭复杂系统的代码组织架构，熟练掌握之后会对于系统的架构有更进一步的认识，从而提升自己在业务上独当一面的能力。

其实，设计模式并不是很遥远的东西，很可能很多时候自己已经在用了而没有感觉出来，比如JavaScript中的全局唯一变量就可以看作是一种单例模式。更宏观一点来看，其实设计模式在社会中早已存在，在计算机被创造出来，人类已经在应用它了，比如“烽火戏诸侯”不就是一种观察者模式（也叫pub-sub注册发布模式）？所以在这个系列中，我会尽可能从贴近生活的角度来阐释每种模式在身边的例子，从而更易于理解模式的思想。

因此，基于JavaScript的设计模式，更多地应该考虑从语言特性、场景和环境出发，不求形似但求神似，重要是模式中传达出的解决思路，领悟了这一点比死记硬背要有用得多，当然还离不开最重要的熟练应用。在这个系列中让我们一起来看一下设计模式与JavaScript会碰撞出什么样的火花。

*重点参考以下两本书：*

+ [JavaScript设计模式](http://book.douban.com/subject/10750116/)

![Learning JavaScript Design Patterns](http://img3.douban.com/lpic/s11268614.jpg)

+ [JavaScript模式](http://book.douban.com/subject/5252901/)

![JavaScript Patterns](http://img3.douban.com/lpic/s4460994.jpg)

在这个系列的开篇，让我们以公认的头号模式——单例模式开始吧。

## 目录

+ 要解决的问题
+ 如何实现
    + 对象字面量
        + 改进的实现
    + 使用`new`创建对象
        + 改进的实现
+ 在开源框架和类库中的应用
+ 总结


### 要解决的问题

单例模式主要目的是确保系统中某个类只存在唯一一个实例，也就是说对于这个类的重复实例的创建始终只返回同一个实例。它和工厂模式一样主要是为了解决对象的创建问题。从前面的描述我们可以看出单例模式的几大特点：

1. 这个类只有一个实例；
2. 该类需要负责实例的初始化工作；
3. 对外需提供这个唯一实例的访问接口。

生活中有单例模式存在吗？有，比如大家都知道的[12306是唯一购票网站](http://news.cnr.cn/native/gd/201310/t20131025_513937251.shtml "唯一购票网站")，所有人要网上订票都得访问这个单例。再比如，法律规定，每个中国男人都只能有一个合法妻子，当然现实之中还有离婚再婚，单例模式更像是理想状况下的白头偕老了。

单例模式带来的好处？除了减少不必要的重复的实例创建、减少内存占用外，更重要的是避免多个实例的存在造成逻辑上的错误。比如超级马里奥的游戏中，虽然各种小怪的实例会不断创建多个，但当前的玩家肯定只有一个，如果游戏运行过程中创建出新的马里奥的实例了，显然就出bug了。

### 如何实现

#### 1. 对象字面量

对于Java之类的静态语言而言，实现单例模式常见的方法就是将构造函数私有化，对外提供一个比如名为`getInstance`方法的静态接口来访问初始化好的私有静态的类自身实例。但对于JavaScript这样的动态语言而言，单例模式的实现其实可以很灵活，因为JavaScript语言中并不存在严格意义上的类的概念，只有对象。每次创建出的新对象都和其他的对象在逻辑上不相等，即使它们是具有完全相同的成员属性的同构造器创造出的对象。所以，在JavaScript中，最常见的单例模式莫过于对象字面量（object literal）了：

{% codeblock lang:javascript %}
var x = {
    attr: 'value'
};

var y = {
    attr: 'value'
};

x == y;     // false
x === y;    // false
{% endcodeblock %}

可见，对象字面量就是一种最简单最常见的单例模式了。在全局的其他地方要获得这个单例的对象，其实就是获得这个唯一的全局变量就可以保证访问的是同一实例了。


##### 改进的实现

上面的对象字面量仅仅是一个简单的键值对，但很多时候对象可能还涉及到初始化的工作，可能需要实现按需加载（懒加载），对象中还会存在内部私有成员，对外需以门面模式（Facade）提供可访问的接口。所以我们还可以把这个简单的对象字面量再扩充一下：

{% codeblock lang:javascript %}
var SuperMario = (function(){

    var instance = null;

    // 初始化函数
    function init(){
        
        var gener = 'male',
            age = 12,
            height = 120;
        
        // 门面模式返回成员属性
        return {
            
            name: 'Mario',

            getAge: function(){
                return age;
            },
            getHeight: function(){
                return height;
            },
            
            jump: function(){
                console.log("I'm jumping!");
            },
            run: function(){
                console.log("I'm running!");
            }
        };
    }

    return {
        
        getInstance: function(){
            if(!instance){
                instance = init();
            }
            return instance;
        }    
        
    };
    
})();
console.log(SuperMario.getInstance());
{% endcodeblock %}

在Chrome控制台下运行可以得到如下结果：

![单例模式运行](/img/jspatterns/singleton-literalobject.png)

让我们来简单分析一下这段代码。首先依然是给对象赋值，但是采用的是即时函数的方式，从而创建出一个闭包，里面存放着SuperMario的真身——`instance`，在结尾时暴露一个`getInstance`方法向外提供该实例的引用，有点像静态语言中的单例模式了吧？

在这个闭包之内，创建了一个内部私有的`init`初始化函数，完成SuperMario对象的初始化工作。注意到这里再一次使用了闭包，将`age`、`height`这些私有成员的值保护起来，对外只提供`getter`访问器，不允许外部代码对其修改。除此之外，还向外提供了可公开的`run`、`jump`方法。

为了实现懒加载，`init`初始函数并不是自动执行的，而是调用`getInstance`方法时检查到当前`instance`还没有被初始化过时才会去执行`init`，而在下次再次`getInstance`时就直接返回之前已初始化好的实例了，这样就不至于给页面的初始化工作带来太大的负担，而是需要使用的时候按需完成初始化。


#### 2. 使用`new`创建对象

虽然JavaScript中没有类，但是却也具有`new`这个关键字来利用构造函数创建对象。对于这种形式创建的对象，要实现单例模式的思想，就需要保证每次`new`出来的对象都是对同一对象的指针。也就是说预期应该像下面的代码这样：

{% codeblock lang:javascript %}
var x = new SuperMario();
var y = new SuperMario();
x == y;     // true
{% endcodeblock %}

因此需要保证x和y指向的是同一个SuperMario构造函数构造出的对象，即第二次调用`SuperMario`构造函数返回的是第一次调用时构造出的实例的引用，同样以后每次调用该构造函数返回的应该都是这同一实例的引用。那么实现上主要就是要解决这个实例的存放位置问题，有几种选择方案：

+ 使用全局变量来存储。当然这种方案一般都不值得推荐；
+ 缓存到`SuperMario`构造函数的静态属性中，实现起来也比较简洁，但缺点是不能避免该静态属性被外部代码修改，毕竟JavaScript不像静态语言能做到对静态属性的写保护；
+ 借助闭包实现。这样可以确保实例的内部私有性，缺点是额外的开销，这是引入闭包必然会带来的弊端。

下面分别看看后两种方案的具体实现。

##### 2.1 静态属性中的实例

采用静态属性的方式代码比较简单易懂，基本的结构类似这样：

{% codeblock lang:javascript %}
// 定义
function SuperMario(){
	
	// 判断当前静态属性是否已存在
	if(typeof SuperMario.instance === "object"){
		return SuperMario.instance;
	}

	// 定义属性值
	this.name = "Mario";
	this.age = 12;
	this.gener = "male";

	// 缓存到静态属性中
	SuperMario.instance = this;

	// 可要可不要，默认隐式返回this
	return this;
	
}

// 执行
var x = new SuperMario();
var y = new SuperMario();
x == y;	// true
{% endcodeblock %}

看上去很简单对吧？不过问题来了：

如果在执行部分添加一行代码：

{% codeblock lang:javascript %}
// 执行
var x = new SuperMario();
SuperMario.instance = null;
var y = new SuperMario();
x == y;			// ?
console.log(y);	// ?
{% endcodeblock %}

你肯定已经猜到了此时`x == y`结果是`false`，而对于下一行呢？`console.log(y)`将输出什么呢？

更进一步地，如果我们在`SuperMario`的构造函数中再加一行：

{% codeblock lang:javascript %}
// 定义
function SuperMario(){

	this.attr = 'value';
	
	// 判断当前静态属性是否已存在
	if(typeof SuperMario.instance === "object"){
		return SuperMario.instance;
	}

	...
	
}
{% endcodeblock %}

此时`console.log(y)`又会返回什么呢？

其实这里涉及到的是一个构造函数返回值的问题，大多数情况下我们都不会在构造函数中显式返回值，因为默认的this会自动隐式返回。说到这里，你可能需要先深入了解下当以`new`操作符调用构造函数时到底发生了什么？

{% blockquote JavaScript Patterns, Stoyan Stefanov(中文版P45) %}
当以`new`操作符调用构造函数时，函数内部将会发生以下情况：
1. 创建一个空对象并且`this`变量引用了该对象，同时还继承了该函数的原型；
2. 属性和方法被加入到`this`引用的对象中；
3. 新创建的对象由`this`所引用，并且最后隐式地返回`this`（如果没有显式地返回其他对象）
{% endblockquote %}

那么在构造函数中定义了`return`时，以`new`调用的结果是怎样的呢？

在stackoverflow上也有类似的问题：[What values can a constructor return to avoid returning this?](http://stackoverflow.com/questions/1978049/what-values-can-a-constructor-return-to-avoid-returning-this)，第一个回答的引用，也就是[ECMA-262中定义了返回策略](http://bclary.com/2004/11/07/#a-13.2.2)。

我们也可以把结论简单记为两条：

1. 当`return`一个引用对象（数组、函数、对象等）时，直接覆盖内部的隐式`this`对象，返回值就是该引用对象；
2. 当`return`5种基本类型（`undefined`、`null`、`Boolean`、`Number`、`String`）之一时（无`return`时其实就是返回`undefined`），返回内部隐式`this`对象。

还需要注意一点，基本类型可以以包装器包装成对象，所以：

{% codeblock lang:javascript %}
function SuperMario(){
	...
	return new String('mario');
	return 'mario';
}
{% endcodeblock %}

两者的返回值就不一样了。

现在你应该可以得出上面的问题的答案了吧？

##### 2.2 闭包中的实例

##### 改进的实现

### 在开源框架和类库中的应用

单例模式在开源框架中应用其实很广泛，细数一下我们熟悉的前端开源框架和类库：jQuery、YUI、underscore、KISSY。

### 总结

未完待续...

{% codeblock lang:javascript %}
{% endcodeblock %}
