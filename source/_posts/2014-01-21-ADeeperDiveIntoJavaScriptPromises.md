---
layout: post
title: "[译]A Deeper Dive Into JavaScript Promises"
category: '翻译' 
tags: ['Promise']
cover: "/img/jspatterns/observer-cover.jpg"
---

原文：[A Deeper Dive Into JavaScript Promises](http://www.sitepoint.com/deeper-dive-javascript-promises/)

*[上一篇An Overview of JavaScript Promises](http://dickeylth.github.io/2014/01/18/AnOverviewOfJavaScriptPromises/)中对Promise中的API做了简单介绍，本文让我们一起来深入认识下上文中的一些概念。*

<!--more-->

我的[上一篇关于JavaScript中新引入的Promise的API的文章](http://www.sitepoint.com/overview-javascript-promises/)中讨论了Promise中的基础知识、错误处理和链式概念。将多个Promise链起来往往很有必要，从而将异步操作序列化起来。但是，很多时候我们需要跟踪每个任务的完成状态，从而相应地执行接下来的操作。由于异步任务可能会以任意次序完成，当执行多个异步操作时想要维护一个队列会很有挑战性。本文试图详细分解这些概念。

### 仔细看看Promise链

我们已经知道了如何使用`then()`将多个Promise链起来。现在，让我们来理解下当我们调用`then()`时事实上发生了什么。看看下面的代码：

``` javascript
var newPromise = getPromise(someData).then(function(data) {  // Line 1
  return getPromise(data);  //Line 2
}).then(function(data){  //Line 3
  //use this data
});
```

这里假定`getPromise()`函数构造一个新的`Promise`对象并返回。你应该会注意到，`then()`的返回类型是一个新的`Promise`对象。在之前的例子中，第1行返回一个新的`Promise`。我们还给`then()`传入了一个回调函数。回调函数的返回值用于兑现或否决该promise。但是，如果回调函数返回的是另一个`Promise`，那么新的`Promise`（由`then()`返回的那个）只有在当前的`Promise`兑现时才会被兑现。

在第3行中我们还将另一个`then()`链接起来，它将等待第2行中的`Promise`的返回。传递给这个`then()`的回调函数将会接收到第2行中返回的`Promise`的兑现值并调用。你可以像这样将多个`Promise`一直链下去。如果你需要处理任何异常，你可以添加一个`catch()`，正如我之前的文章中所讨论的。

既然你已经知道了Promise链是如何工作的，我们可以进一步看看异步操作是如何按顺序执行的。但首先，你需要了解一点额外的知识。

### `resolve()`和`reject()`方法

Promise API中暴露了几个有用的方法降低使用难度。其中之一就是`resolve()`，它会创建一个新的`Promise`对象，该promise始终是解决成功了的。这意味着如果你以这种方式创建了一个`Promise`并附加上一个`then()`，处理成功状态的回调函数始终会被调用。你也可以给`resolve()`传入一个参数，它将成为该promise的兑现值。如果什么都没有传入，兑现值就是`undefined`。类似的，`reject()`方法创建一个始终为否决状态的`Promise`对象。下面的例子展示了`resolve()`和`reject()`是如何使用的。

``` javascript
Promise.resolve('this always resolves').then(function(data) {
  alert(data); //this is called
});
 
Promise.reject('this always rejects').then(function(data) {
  alert(data); // this is never called
}).catch(function(err) {
  alert(err); //this is called
});
```


### 强制序列化任务执行

让我们来创建一个简单的应用，它将接收一串电影名，然后获取每个电影名对应的海报。下面是HTML标记，呈现一个输入域用以输入逗号分隔的电影名：

``` html
<!DOCTYPE html>
<html>
  <head>
    <script src="script.js"></script>
  </head>
  <body>
    <input type="text" name="titles" id="titles" placeholder="comma separated movie titles" size="30"/>
    <input type="button" value="fetch" onclick="fetchMovies()" />
    <input type="button" value="clear" onclick="clearMovies()" />
    <div id="movies">
    </div>
  </body>
</html>

```

现在让我们使用Promise来异步地为每部电影下载一张海报。下面的函数创建了一个`Promise`并传入一个回调函数，用来从远程API加载影片信息。

``` javascript
function getMovie(title) {
  return new Promise(function(resolve, reject) {
    var request = new XMLHttpRequest();
 
    request.open('GET', 'http://mymovieapi.com/?q=' + title);
    request.onload = function() {
      if (request.status == 200) {
        resolve(request.response); // we get the data here, so resolve the Promise
      } else {
        reject(Error(request.statusText)); // if status is not 200 OK, reject.
      }
    };
 
    request.onerror = function() {
      reject(Error("Error fetching data.")); // error occurred, so reject the Promise
    };
 
    request.send(); // send the request
  });
}
```

下面的代码片段用来处理加载的数据并以影片海报更新HTML页面。

``` javascript
function fetchMovies() {
  var titles = document.getElementById('titles').value.split(',');
 
  for (var i in titles) {
    getMovie(titles[i]).then(function(data) {
      var img = JSON.parse(data)[0].poster.imdb;
 
      document.getElementById('movies').innerHTML = document.getElementById('movies').innerHTML + '<img src="' + img + '"/>';
    }).catch(function(error) {
      console.log(error);
    });
  }
}
```

上面的代码基本上是自解释的。它只是简单地遍历了影片名列表，并为每个影片抓去对应的IMDB海报。你可以在这个[Plunkr 示例](http://plnkr.co/edit/7KmEh2rCcSszKpFUOFOg?p=preview)上看到实际演示效果。

但是，还有个问题！在Plunkr的示例中输入以逗号分隔的一些影片名然后点击获取按钮。如果你按了好几次获取按钮，就会发现图片下载并不存在一定的顺序！Promise可能会以任何顺序成功解决，因此，图片每次都会以不同的顺序完成加载。所以，如果我们需要以特定的顺序获取影片海报，这段代码并不能满足要求。

我们可以以两种方式强制加载顺序。首先，我们可以在只有前一个片名的`Promise`成功解决后，才为当前影片名创建一个`Promise`。另一种方式需要创建一个单独的`Promise`，只有当每部影片名对应的`Promise`都成功解决了该promise才会解决，并按顺序传入所有的兑现值（成功解决的返回值）。

### 选择一

看看下面的代码片段。我们首先创建一个始终为成功解决状态的`Promise`。这是用来跟踪之前的`Promise`。在循环内，我们调用`prevPromise.then()`，它将返回一个新的`Promise`，然后我们将其赋值给`prevPromise`。当由`getMovie(title)`返回的`Promise`成功解决时，该`Promise`才会成功解决。因此，只有当前一个`Promise`（`prevPromise`表示的）成功解决了，新的加载影片海报的`Promise`才会被创建。通过这种方式，我们可以按顺序加载图片，但仍然保持异步的方式。试试这个更新的[Plunkr](http://plnkr.co/edit/FbVOEBI7lL6uiedFZEzD?p=preview)。每次你点击获取按钮，海报将会按顺序加载。

``` javascript
function fetchMovies() {
  var titles = document.getElementById('titles').value.split(',');
  var prevPromise = Promise.resolve(); // initial Promise always resolves
 
  titles.forEach(function(title) {  // loop through each title
    prevPromise = prevPromise.then(function() { // prevPromise changes in each iteration
      return getMovie(title); // return a new Promise
    }).then(function(data) {
      var img = JSON.parse(data)[0].poster.imdb;
 
      document.getElementById('movies').innerHTML = document.getElementById('movies').innerHTML + '<img src="' + img + '"/>';
    }).catch(function(error) {
      console.log(error);
    });
  });
}
```

### 选择二

下面的代码中`Promise.all()`接收一组`Promise`，只有当这组`Promise`全部成功解决时，该`Promise.all()`返回的`Promise`才会成功解决。这个返回的`Promise`的兑现值是包含组中每个`Promise`的兑现值并按顺序维护的数组。因此，一旦这个`Promise`成功解决了，我们只需要遍历这个数据数组并从中抽取影片海报。这里是一个[Plunkr 示例](http://plnkr.co/edit/MBZfY3B6FQqd07U0vRZK?p=preview)。另外需要注意的是，如果这组`Promise`中有任何一个否决了，`Promise.all()`返回的新的`Promise`就是以该否决值转入否决状态了。

``` javascript
function fetchMovies() {
  var titles = document.getElementById('titles').value.split(',');
  var promises = [];
 
  for (var i in titles) {
    promises.push(getMovie(titles[i])); // push the Promises to our array
  }
 
  Promise.all(promises).then(function(dataArr) {
    dataArr.forEach(function(data) {
      var img = JSON.parse(data)[0].poster.imdb;
 
      document.getElementById('movies').innerHTML = document.getElementById('movies').innerHTML + '<img src="' + img + '"/>';
    });
  }).catch(function(err) {
    console.log(err);
  });
}
```

### 总结

本文讨论了JavaScript Promise中的一些更高级的概念。为了保证这些代码顺利执行，你需要确保升级浏览器到Chrome 32 beta或是最新的Firefox nightly。浏览器完全实现这些特性还需要一些时间。除此之外，毫无疑问Promise将会成为JavaScript中下一个大突破。


![Sandeep Panda](http://1.gravatar.com/avatar/ba63b07b15dfc9d3b718118e82544309?s=96&d=http%3A%2F%2F1.gravatar.com%2Favatar%2Fad516503a11cd5ca435acc9bb6523536%3Fs%3D96&r=G)

#### Sandeep Panda

Sandeep Panda是一位web开发者和作家，对Java、JavaScript和HTML5充满热情，拥有4年以上web开发经验，一直热爱尝试各种新生的新技术并持续学习。不开发的时候，Sandeep喜欢玩游戏和听音乐。