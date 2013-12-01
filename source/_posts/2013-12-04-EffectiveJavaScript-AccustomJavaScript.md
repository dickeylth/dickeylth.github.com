---
layout: post
title: "Effective JavaScript读书笔记(1)——适应JavaScript"
category: '笔记' 
tags: ['Effective JavaScript']
cover: "/img/jspatterns/observer-cover.jpg"
---

《Effective JavaScript》是一本深入探讨JavaScript语言以及如何使用它高效地编写移植性更强、更健壮并更易于维护的应用和库的书，由Mozilla研究院高级研究员David Herman编写。本书还有个副标题叫“68 Specific Ways to Harness the Power of JavaScript”。这个系列，让我们一起走进这本书，更深入地认识JavaScript。本文是第一章节——《Accustoming Yourself to JavaScript》（适应JavaScript》的笔记。

<!--more-->

JavaScript最初的语法设计上就和其他语言比较类似，看上去似乎易于掌握，其中的核心概念也不多。虽然JavaScript看上去平易近人，但掌握这门语言却需要更多的时间，以及对于语义、特性和惯用语法的深入理解。第一章节，首先来看看一些最基本的内容。

## 目录
1. 了解你正在使用的JavaScript的版本
2. 

### 1. 了解你正在使用的JavaScript的版本

JavaScript于1997年正式成为国际标准，被正式称为ECMAScript。如今有许多为ECMA-Script标准的不同版本提供一致性的相互竞争的JavaScript实现。1999年最终确定的ECMAScript标准第3版（通常被称为ES3），仍然是最广为采用的JavaScript版本。接下来的标准的主要进展将是2009年发布的第5版（ES5），其中引入了许多新特性，并将之前一些广受支持但并未明确的特性进行标准化。

除了标准的多版本外，还有一些未标准化的特性，只在特定的JavaScript实现环境中支持。例如，`const`关键字仍未在ECMAScript标准中指定语法或行为的定义，但在很多JavaScript引擎中都已提供了支持，而且具体行为在不同的实现中有差异。在某些情况下`const`变量不允许更新：

{% codeblock lang:javascript %}
const PI = 3.141592653589793;
PI = "modified!";
PI; // 3.141592653589793
{% endcodeblock %}

但在另一些实现中仅仅将`const`视为`var`的同义词：

{% codeblock lang:javascript %}
const PI = 3.141592653589793;
PI = "modified!";
PI; // "modified!"
{% endcodeblock %}

由于JavaScript历史原因和实现多样，很难跟踪在某个平台上支持哪些特性。造成这种问题的原因之一还有JavaScript的核心生态环境——web浏览器——并不会将可用的JavaScript版本的控制权交给程序员，从而执行代码。由于终端用户的浏览器和版本的多样性，web程序不得不考虑各种跨浏览器兼容性问题。

除了在浏览器环境下，JavaScript还可以在服务器端程序、浏览器扩展和移动与桌面应用脚本等环境下使用。在这些情况下，充分发挥平台下JavaScript的特定实现支持的额外特性是很合理的。

对于某些受到广泛支持但还没有被标准化的特性的使用需要很小心，因为你的代码可能会运行在不支持这些特性的环境下。比如`const`在无法识别该关键字的浏览器中使用时就会被抛出语法错误。

ES5还引入了另一个出于版本管理考虑的*strict mode（严格模式）*，在该模式下禁止JavaScript中某些容易引起问题和易出错的特性的使用。其语法也被设计为向下兼容的，通过在代码的最前面添加一个特定的字符串常量来启用：

{% codeblock lang:javascript %}
"use strict";
{% endcodeblock %}

类似地，你也可以在函数内启用严格模式：

{% codeblock lang:javascript %}
function f(x) {
    "use strict";
    // ...
}
{% endcodeblock %}

在ES3的环境下只会将这个字符串字面量视为一条无害的声明，而在ES5中下面的代码就无法通过了：

{% codeblock lang:javascript %}
function f(x) {
    "use strict";
    var arguments = []; // error: redefinition of arguments
    // ...
}
{% endcodeblock %}

在严格模式下重定义`arguments`变量是禁止的，但在没有实现严格模式检查的环境中这段代码是可接受的。于是在实现了ES5的环境中部署这段代码就会出错。因此，你始终应该在完全兼容ES5环境下测试严格模式。

使用严格模式的缺陷之一是`use strict`指令只有在脚本或函数的最前面定义才能被识别，因而对于*script concatenation（脚本串联）*——在开发阶段以多个单独的文件组织而在部署到生产环境时合并到单一文件中——很敏感。想想如果有2个文件`file1.js`和`file2.js`，其中`file1.js`需要在严格模式下执行，而`file2.js`不需要，当两个文件合并到一个文件中后，如果`file1.js`在前面，指定了严格模式，那么`file1.js`和`file2.js`都会处于严格模式下。而如果`file2.js`在前面，此时`use strict;`指令就失效了，两个文件都不在严格模式下。要解决这个问题有以下几种办法：

*永远不要将严格模式和非严格模式下的文件合并到一起*

这大概是最简单的解决办法，但当然也会限制你对于应用或库的文件结构的控制权。在最好的情况下你也得部署两个单独的文件，分别包含所有的严格模式文件和非严格模式文件。

*将文件内容包装到即时函数表达式中然后合并*

通过将每个文件的内容包装到一个函数中，就可以各自独立地以不同的模式来解析了。合并后的文件可能长下面这个样子:

{% codeblock lang:javascript %}
// no strict-mode directive
(function() {
    // file1.js
    "use strict";
    function f() {
        // ...
    }
    // ...
})();
(function() {
    // file2.js
    // no strict-mode directive
    function f() {
        var arguments = [];
        // ...
    }
    // ...
})();
{% endcodeblock %}

于是严格模式的指定只会影响到所在文件的单独的作用域中了。但这样有个前提，就是各个文件不能假定自己可以在全局作用域中被解析，这就像是常见的*模块系统*的情形了，所有的文件内容都位于局部作用域中。

*编写在两种模式下行为一致的脚本文件*

为了编写可以适应尽可能多的上下文环境的库，你无法对代码执行环境作出任何假定。使你的代码具备最好的兼容性的最简单的办法就是在严格模式下编写代码，但是显式地包装你的全部代码内容到局部开启严格模式的函数中。这和上面一种解决方案很类似，都是将每个文件的内容包装到即时函数中，但不同的是这次你需要手工编写即时函数，而不是依赖于合并工具或是模块系统来帮你完成，并且显式地选择开启严格模式：

{% codeblock lang:javascript %}
(function() {
    "use strict";
    function f() {
        // ...
    }
    // ...
})();
{% endcodeblock %}

所以更为通用的兼容性的选项是在严格模式下编写代码。

#### 需要记住的事：
+ 确定应用程序支持的JavaScript版本
+ 确保你用到的JavaScript特性在应用程序运行的各种环境下都支持
+ 始终在执行严格模式检查的环境下测试代码是否在严格模式下能跑通
+ 注意需要合并多个脚本中部分支持严格模式的情形

### 2. 理解JavaScript中的浮点数