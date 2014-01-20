---
layout: post
title: "[译]An Overview of JavaScript Promises"
category: '翻译' 
tags: ['Promise']
cover: "/img/jspatterns/observer-cover.jpg"
---

原文：[An Overview of JavaScript Promises](http://www.sitepoint.com/overview-javascript-promises)

*JavaScript 中的 Promise 让人总感觉有种神秘感，通过这个系列 2 篇译文，让我们一起来走近 Promise，感受一下高级功能。*

<!--more-->

唔，这看起来像是给所有的 JavaScript 开发者们的圣诞节礼物。得知 Promise 现在成为 JavaScript 标准的一部分，你一定会很开心。Chrome 32 beta 已经实现了基本的 Promise API。Promise 的概念对于 web 开发并不陌生。我们之中很多人已经通过某些 JS 库使用过 Promise 了，诸如 Q、when、RSVP.js 等。甚至 jQuery 中也有叫做 Deferred 的玩意儿，跟 Promise 很相似。但是在 JavaScript 中拥有对 Promise 的原生支持真的很神奇。这篇教程将会涉及 Promise 的基础，并向你展示如何在 JS 开发中充分应用。

友情提示：这仍然是个实验性特性。只有 Chrome 32 beta 和最新的 Firefox nightly 版本目前支持。

### 概述

一个`Promise`对象代表一个尚不可用但未来某个时刻会确定的值。它允许你以更加同步化的风格来编写异步的代码。例如，如果你使用 Promise API 来执行一个到远程 web 服务的异步调用，你需要创建一个`Promise`对象，表示稍后由 web 服务返回的数据。需要说明的是，实际上当前数据还不可用。当请求结束并且收到 web 服务返回的响应时数据才能变为可用。在此期间，`Promise`对象就像真实数据的代理。进一步地，你可以绑定回调函数到`Promise`对象上，当真实数据一旦可用时就会调用回调函数。

### API

让我们以研究下面的创建新的Promise对象的代码作为开始。

``` javascript
if (window.Promise) { // Check if the browser supports Promises
  var promise = new Promise(function(resolve, reject) {
    //asynchronous code goes here
  });
}
```

我们首先初始化一个新的`Promise`对象并传入一个回调函数。回调函数接收2个函数类型的参数，`resolve()`和`reject()`。你的所有的异步代码都写在回调函数中。如果一切正常，`Promise`就会通过调用`resolve()`转入成功解决状态。如果发生错误，`reject()`函数就会被调用，同时传入一个`Error`对象。这意味着`Promise`被否决了。

现在让我们来通过简单的例子来演示下 Promise 是如何使用的。下面的代码创建一个异步请求到 web 服务，以 JSON 格式返回一个随机的笑话。让我们看看这里是如何使用 Promise 的。

``` javascript
if (window.Promise) {
  console.log('Promise found');
 
  var promise = new Promise(function(resolve, reject) {
    var request = new XMLHttpRequest();
 
    request.open('GET', 'http://api.icndb.com/jokes/random');
    request.onload = function() {
      if (request.status == 200) {
        resolve(request.response); // we got data here, so resolve the Promise
      } else {
        reject(Error(request.statusText)); // status is not 200 OK, so reject
      }
    };
 
    request.onerror = function() {
      reject(Error('Error fetching data.')); // error occurred, reject the  Promise
    };
 
    request.send(); //send the request
  });
 
  console.log('Asynchronous request made.');
 
  promise.then(function(data) {
    console.log('Got data! Promise fulfilled.');
    document.getElementsByTagName('body')[0].textContent = JSON.parse(data).value.joke;
  }, function(error) {
    console.log('Promise rejected.');
    console.log(error.message);
  });
} else {
  console.log('Promise not available');
}
```


我们已经知道了如何使用`then()`将多个Promise链起来。现在，让我们来理解下当我们调用`then()`时事实上发生了什么。看看下面的代码：

``` javascript
var newPromise = getPromise(someData).then(function(data) {  // Line 1
  return getPromise(data);  //Line 2
}).then(function(data){  //Line 3
  //use this data
});
```

在前面的代码中，`Promise()`构造函数中的回调函数包含了用来从远程服务获取数据的异步代码。这里，我们只是创建了Ajax请求到`http://api.icndb.com/jokes/random`，它将会返回一个随机的笑话。当从远程服务器接收到JSON格式响应时，就会将其传入`resolve()`函数。一旦有任何错误出现，就会调用`reject()`方法并传入一个`Error`对象。

当我们初始化一个`Promise`对象，就得到了一个稍后可用的数据的代理。在本例中，我们期望稍后某个时刻会从远程服务获得返回的一些数据。那么，我们怎么知道数据什么时候可用了呢？这就是`Promise.then()`函数的用处。`then()`函数接收2个参数：一个处理成功状态的回调函数和一个处理失败状态的回调函数。当`Promise`处理之后（也就是要么成功要么失败），这些回调函数就会被调用。如果`Promise`处理成功，对应的处理成功状态的回调函数就会被触发，并接收到你传入`resolve()`函数中的真实数据。如果Promise失败，相应的处理失败状态的回调就会被调用。 任何你传入`reject()`函数中的东西就会作为参数传入该回调函数中。

试试这个[Plunkr](http://plnkr.co/edit/ilf9xtDqrimWxZd77yLI?p=preview)上的例子。只需要刷新下页面就可以看到一个新的随机的笑话。而且，打开浏览器控制台，你就会看到代码的不同部分是以什么顺序来执行的。此外，注意一个Promise可以处于 3 种状态：

- pending(未决的，尚未成功或失败)
- fulfilled（成功）
- rejected（失败）

`Promise.status`属性提供了状态信息，但它是不能通过代码访问到并且是私有的。一旦Promise成功或失败，状态就会保持不变。这意味着 Promise 只能成功或失败一次。如果Promise已经成功了，之后你给它附加上一个`then()`，传入2个回调函数，那么处理成功状态的回调函数就会正确地被调用。所以在Promise的世界里，我们并不关心Promise何时处理完成。我们只关心Promise最终的处理结果。

### 链式 Promise

有时候可能需要将多个Promise链起来。比如，你需要执行多个异步的操作。当一个操作返回了数据，你就要开始对这些数据执行其他的某个操作等。Promise可以被链接起来，就像下面的代码中所演示的。

``` javascript
function getPromise(url) {
  // return a Promise here
  // send an async request to the url as a part of promise
  // after getting the result, resolve the promise with it
}
 
var promise = getPromise('some url here');
 
promise.then(function(result) {
  //we have our result here
  return getPromise(result); //return a promise here again
}).then(function(result) {
  //handle the final result
});
```

这段代码中比较难以捉摸的地方是当你在`then()`中返回了一个简单的值后，下一个`then()`就会被调用，并传入前面的返回值。但如果你在`then()`中返回一个`Promise`，下一个`then()`就会等待直到那个Promise处理完成。


### 错误处理

你已经知道了`then()`函数接收 2 个回调函数作为参数。当Promise转为失败状态时第二个函数就会被调用。不过，我们还可以用`catch()`函数来处理 Promise 失败。看看下面的代码：

``` javascript
promise.then(function(result) {
  console.log('Got data!', result);
}).catch(function(error) {
  console.log('Error occurred!', error);
});
```

这等价于：

``` javascript
promise.then(function(result) {
  console.log('Got data!', result);
}).then(undefined, function(error) {
  console.log('Error occurred!', error);
});
```

需要注意的是，如果Promise失败并且`then()`中没有处理失败状态的回调函数，控制流就会转入下一个带有处理失败状态的回调函数的`then()`或是下一个`catch()`函数。除了显式的Promise失败，当`Promise()`构造函数中的回调函数抛出任何异常时，`catch()`也会被调用。所以，你也可以使用`catch()`来记录日志。注意，我们可以使用`try..catch`来处理错误，但对于Promise而言并非必要，因为任何异步或同步的错误始终会被`catch()`所捕获。

### 总结

这只是一篇对JavaScript的新的Promise API的简要介绍。显然它会使异步代码写起来非常容易。我们可以像往常一样写代码，而不必知道稍后异步代码中会返回什么值。API中还有很多东西这里没有提到。浏览下面的资源并保持关注SitePoint来了解关于Promise的更多东西吧。


![Sandeep Panda](http://1.gravatar.com/avatar/ba63b07b15dfc9d3b718118e82544309?s=96&d=http%3A%2F%2F1.gravatar.com%2Favatar%2Fad516503a11cd5ca435acc9bb6523536%3Fs%3D96&r=G)

#### Sandeep Panda

Sandeep Panda是一位web开发者和作家，对Java、JavaScript和HTML5充满热情，拥有4年以上web开发经验，一直热爱尝试各种新生的新技术并持续学习。不开发的时候，Sandeep喜欢玩游戏和听音乐。