---
layout: draft
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
2. 理解JavaScript中的浮点数
3. 注意隐式转换

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

在JavaScript中只有一种数字类型，即`number`，事实上所有的数字都是双精度浮点数，也就是由IEEE 754标准规定的64位数字编码，常被称为"doubles"（双精度）.在JavaScript中双精度浮点型以高达53位的精度完美地实现整数的表示，可表示的有效数字区间为-2<sup>53</sup> ~ 2<sup>53</sup>。因此虽然没有单独的整型类型，JavaScript中的整数运算已经足够完美了。

注意在位元运算中，会将操作数隐式转换为32位整数（确切地说，32位大端补码整数），比如下面的例子：

{% codeblock lang:javascript %}
var x = 13.1 | 1;
{% endcodeblock %}

首先会将13.1转为32位整数（向上取整）即0000 0000 0000 0000 0000 0000 0000 1110(14)，然后与32位表示的1做或运算，返回15。

另外需要注意的就是浮点数计算是不准确的，虽然64位精度已经很高了，但是能表示的数字的集合也是有限的，对于浮点数运算只能给出大致的结果，并且在连续运算中这种误差会逐渐累积。舍入往往还会给我们带来意想不到的偏差。比如说实数一般是满足结合律的：`(x + y) + z = x + (y + z)`，但对于JavaScript中的浮点数却未必：

{% codeblock lang:javascript %}
(0.1 + 0.2) + 0.3; // 0.6000000000000001
0.1 + (0.2 + 0.3); // 0.6
{% endcodeblock %}

浮点数在准确度和性能之间做了折中，当准确度很重要时就需要注意浮点数运算的精确度的限制了。解决的办法之一是尽可能处理整型值以回避舍入问题。比如对于处理金钱的计算，将数字都转换为以当前币种的最小面值为单位的数字，从而计算时保证处理的都是整数。不过还是需要注意JavaScript中能表示的数字范围。

#### 需要记住的事：
+ JavaScript中的数字都是浮点型双精度的
+ JavaScript中的整型只是双精度的一个子集，而非单独的数据类型
+ 位运算将操作数视为32位有符号整数
+ 注意浮点运算中的精度限制

### 3.注意隐式转换

当操作的数据类型不对时，在静态语言中这样的表达式根本不会被允许执行，即使在某些动态语言中允许这样的程序执行，也会抛出运行时异常，但在JavaScript中却不太一样，它不仅可以执行，而且还会顺利计算出结果。

虽然很多情况下错误的类型调用在JavaScript中会产生即时错误，比如调用非函数（`nonfunction`）或是获取`null`对象的属性值，但在很多其他的情况下，JavaScript采取的策略是根据不同的自动转换机制对值进行强制转换，而不是抛出错误。比如说，对于`-`、`*`、`/`和`%`，都会在计算前试图转换参数为数字，而对于`+`则有些不一样，因为它被重载为可以执行数字加法运算或是字符串拼接，一切取决于要处理的参数类型。比较一下下面的例子：

{% codeblock lang:javascript %}
1 + 2 + "3";    // "33"
(1 + 2) + "3";  // "33"
1 + "2" + 3;    // "123"
{% endcodeblock %}

位运算，包括位算术运算（`~`、`&`、`^`和`|`）和移位操作符（`<<`、`>>`和`>>>`），会将操作数转换为不仅是数字，而是第2节中讨论的可以以32位整型表示的数字。这些强制转换有时可能会因为很方便而吸引人——例如，自动将来自用户输入、文本文件或是网络流的字符串进行转换：
 
{% codeblock lang:javascript %}
17" * 3;  	// 51
"8" | "1"; 	// 9”
{% endcodeblock %}

但是强制转换也会将错误隐藏。参与算术运算的变量实际值为`null`也不会造成运算错误，而是会静默地转换为0，实际值为`undefined`的变量也会被转换为特殊的浮点值`NaN`。有了这些强制转换，运算可以继续下去，但往往得出令人困惑而无法预料的结果，而不是立即抛出异常。

令人沮丧的是，针对`NaN`值的测试甚至是极为困难的。首先，JavaScript遵循IEEE浮点规范中令人困惑的要求——`NaN`被视为与自身不相等。所以测试一个值是否与`NaN`相等是无效的：

{% codeblock lang:javascript %}
var x = NaN;
x === NaN;    // false
{% endcodeblock %}

此外，标准的`isNaN`库函数并不是非常可靠，因为它附带了自己的隐式强制转换，在测试值之前将传入的参数转换为数字。（`isNaN`更准确的名字应该是`coercesToNaN`。）如果你已经知道了某个值是数字，你可以使用`isNaN`来测试它是否是`NaN`：

{% codeblock lang:javascript %}
isNaN(NaN);	// true
{% endcodeblock %}

但是对于其他显然不是`NaN`，然而却可被强制转换为`NaN`的值，`isNaN`就无法辨识了：

{% codeblock lang:javascript %}
isNaN("foo");              // true
isNaN(undefined);          // true
isNaN({});                 // true
isNaN({ valueOf: "foo" }); // true
{% endcodeblock %}

幸运的是有种范式不仅可靠而且准确——尽管有些不直观——来测试`NaN`。由于`NaN`是唯一的会被视为与自身不相等的JavaScript值，你可以随时通过检查一个值是否与自身相等，从而知道它是不是`NaN`：

{% codeblock lang:javascript %}
var a = NaN;
a !== a;                     // true
var b = "foo";
b !== b;                     // false
var c = undefined;
c !== c;                     // false
var d = {};
d !== d;                     // false
var e = { valueOf: "foo" };
e !== e;                     // false
{% endcodeblock %}

你可以将该模式抽离为一个清晰命名的工具函数：

{% codeblock lang:javascript %}
function isReallyNaN(x) {
    return x !== x;
}
{% endcodeblock %}

但测试一个值是否与自身相等是如此简洁，因而往往实际应用中并不需要这个辅助函数，所以认识和理解这种模式很有必要。

静默强制转换会给调试带来麻烦，因为错误会被掩盖起来不易诊断。当运算出错时，调试的最好办法是检查计算的中间结果，回到出错前的最后运算点。从那儿，你可以检查每个操作的参数，从中查找类型错误的参数。根据bug的不同，可能会是逻辑错误，比如使用了错误的运算符，或是类型错误，比如传递的是`undefined`值而不是数字。

对象也可能被转换为基本类型。最常见的应用是转换为字符串：

{% codeblock lang:javascript %}
"the Math object: " + Math; // "the Math object: [object Math]"
"the JSON object: " + JSON; // "the JSON object: [object JSON]"
{% endcodeblock %}

对象通过隐式调用自身的`toString`方法转换为基本类型。类似地，对象可以通过自身的`valueOf`方法转换为数字。你可以通过定义这些方法决定对象类型转换的结果：

{% codeblock lang:javascript %}
J" + { toString: function() { return "S"; } }; // "JS"
2 * { valueOf: function() { return 3; } };      // 6
{% endcodeblock %}

然而，对于同时包含`toString`和`valueOf`方法的对象，`+`会调用哪个方法并不明显：理论上应该基于类型选择是作为连接符还是加法运算，但是由于有了隐式转换，实际上类型并没有明确给出！对于这种容易引起歧义的情形，JavaScript采用的是不假思索地优先选择`valueOf`。但这意味着如果有人试图对对象进行字符串连接，结果可能会无法预料：

{% codeblock lang:javascript %}
var obj = {
    toString: function() {
        return "[object MyObject]";
    },
    valueOf: function() {
        return 17;
    }
};
"object: " + obj; // "object: 17”
{% endcodeblock %}

这个例子告诉我们，`valueOf`事实上只是设计为供类似`Number`对象这样的表示数值的对象所使用。对于这些对象，`toString`和`valueOf`方法应返回一致的结果——同一数字的字符串或是数值展示，因此重载的`+`始终保持一致的行为，不论这个对象是用于连接符或是加法。通常来说，相比强制转换为数字，强制转换为字符串常见得多也更为有用。最好避开`valueOf`，除非对象确实是数值抽象并且`obj.toString()`得到的是`obj.valueOf()`调用结果的字符串表示。

