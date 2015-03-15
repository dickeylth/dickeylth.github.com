title: '[译]The Art of Error'
date: 2014-02-07 14:39:24
tags: ['JavaScript']
category: '翻译'
---

JavaScript中的错误处理似乎是一个见仁见智的问题，本文中Alex Young介绍了他认为错误处理中2条应该避免的不好的做法。

<!--more-->

原文链接：[The Art of Error](http://dailyjs.com/2014/01/30/exception-error/)

![Error最初是风靡一时的电子游戏“Zelda”中的一个角色。](http://dailyjs.com/images/posts/iamerror.png)

我喜欢定义很多继承自`Error`的对象，这样有助于事后追踪问题，也有助于清晰地处理预期错误。有时，编写错误处理代码感觉很繁琐无趣，但它不应该作为亡羊补牢的补救措施。经过良好设计和测试的错误不仅会帮助你维护项目，而且也能帮助用户弄明白出错时该怎么办。

谈到使用`Error`，我发现2条应当避免的不好的做法：

1. 使用`new Error`而不是子类；
2. 完全避免`Error`，因为“异常都是不好的”。

让我们来侃侃如何避免这些问题以及如何正确地使用错误。

### 将错误子类化

借助于`Object.create`或`util.inherits`（Node中）很容易将错误子类化。在Node中你会这么来做：

``` javascript
var assert = require('assert');
var util = require('util');

function NotFound(message) {
  Error.call(this);
  this.message = message;
}

util.inherits(NotFound, Error);

var error = new NotFound('/bitcoin-wallet not found');

assert(error.message);
assert(error instanceof NotFound);
assert(error instanceof Error);
assert.equal(error instanceof RangeError, false);
```

上面的断言检查预期的属性（`message`）被设置了，并且`error`是`NotFound`和`Error`的实例而*不是*`RangeError`的。

如果你在使用[Express](http://expressjs.com/)，可以设置其他的属性使错误更有用。在传递错误到路由中的`next()`时这会很有用。当需要处理HTTP层的错误时，我喜欢引入一个状态码：

``` javascript
function NotFound(message) {
  Error.call(this);
  this.message = message;
  this.statusCode = 404;
}
```

现在你可以以更少重复的方式编写处理错误的中间件代码：

``` javascript
app.use(function(err, req, res, next) {
  console.error(err.stack);

  if (!err.statusCode || err.statusCode === 500) {
    emails.error({ err: err, req: req });
  }

  res.send(err.statusCode || 500, err.message);
});
```

这段代码将会发送HTTP状态码到浏览器，如果有的话。此外，只有当状态码为500或未设置时会以邮件发送错误。这段代码是来自于生产环境中，当有异常事件发生时就会发送邮件，而且我也不想收到如401、403和404这样的普通错误的通知。

`console.error(err.stack)`这一行事实上并不会如预期生效。在像Node和Chrome这样的V8平台下，你可以在错误的构造函数中使用`Error.captureStackTrace(this, arguments.callee)`获得堆栈跟踪。

``` javascript
function NotFound(message) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.message = message;
  this.statusCode = 404;
}
```

在为撰写这篇文章而进行调研时，我注意到对于继承`Error`和捕获堆栈存在很多困惑。很难在各个浏览器中恰当地处理。如果你想了解更多，在Stack Overflow上有个不错的帖子：[What’s a good way to extend Error in JavaScript?](http://stackoverflow.com/questions/1382107/whats-a-good-way-to-extend-error-in-javascript)。

### 抛出和捕获错误

可能你会注意到我很少提到`throw`，那是因为我们几乎不再使用它了。更常见的做法是将错误作为第一个参数传递到回调函数中，或是在`error`事件触发时的传入的第一个参数。

如果你在使用这样的API，也许你会在回调函数最前面使用像`if (err) return handleError(err)`这样的代码。你也可以使用`if (err instanceof SpecificError)`来添加自己的上下文特定的错误处理代码。

Node开发者通常避免抛出异常，但如果你觉得确实有必要，可以使用`throw new Error('I am Error')`，然后在测试中使用`assert.throws`。我觉得我几乎用不着使用`throw`。

### 设计错误对象

当你开始子类化`Error`并添加私有属性，由于打破了[SOLID](http://zh.wikipedia.org/wiki/SOLID_(%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E8%AE%BE%E8%AE%A1\))原则，会带来新的问题。为了保持明晰的错误设计，确保每个错误类只具备单一职责——不要创建像瑞士军刀一样的错误对象，或是在它们的构造函数中触发复杂的行为。

此外，还应该在合理的地方创建错误。如果你已经编写了数据库层，不要在从数据库中加载数据的代码中抛出前面的`NotFound`错误。在这种情况下，更好的做法是用一个`Database.NotFound`错误对象，或者也可以返回`undefined`，然后在视图层抛出`NotFound`错误。

遵循[里氏替换原则](http://zh.wikipedia.org/wiki/%E9%87%8C%E6%B0%8F%E6%9B%BF%E6%8D%A2%E5%8E%9F%E5%88%99)也有助于编写可维护的错误处理代码。如果你将前面的`NotFound`错误替换为一个具备更丰富的上下文相关信息的新的类，那么现有的代码应该仍然能正常工作。如果你不知为何改变了`notFound.statusCode`的职责，就会违反这条规则。

### 总结

在我的项目中我创建了很多`Error`类，但我几乎很少用到`throw`和`catch`。你应该在错误对象上设置有用的属性，但以一致的方式使用这些属性。而且，不要玩穿越：HTTP错误不应该在处理数据库的代码中出现。对于浏览器开发者，ajax错误在与服务器交互的代码中可以出现，但不应该在处理Mustache模板的代码中出现。