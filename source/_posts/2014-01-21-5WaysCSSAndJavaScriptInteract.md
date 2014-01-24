---
layout: post
title: "[译]5种也许你还不知道的CSS和JavaScript交互方式"
category: '翻译' 
tags: ['Promise']
cover: "/img/jspatterns/observer-cover.jpg"
---

原文：[5 Ways that CSS and JavaScript Interact That You May Not Know About](http://davidwalsh.name/ways-css-javascript-interact)

*这篇文章提到了5种CSS和JavaScript打交道的相对冷门的方式，让我们一起来认识下。*

<!--more-->

每当浏览器发布时，CSS和JavaScript之间的界限看上去就更加模糊了。通常它们都负责不同的任务，但终究它们都是前端技术，所以需要紧密工作。我们将它们分别维护在.js文件和.css文件中，但这并不意味着它们之间无法超越基本的JavaScript框架运行的范畴而更加紧密地交互。下面是5种也许你还不知道的JavaScript和CSS一起工作的方式！

### 用JavaScript获取伪元素属性

我们都知道可以通过`style`属性获取元素的基本的CSS样式值，但对于伪元素属性呢？是的，JavaScript甚至也可以访问到它们！

``` javascript
// Get the color value of .element:before
var color = window.getComputedStyle(
	document.querySelector('.element'), ':before'
).getPropertyValue('color');

// Get the content value of .element:before
var content = window.getComputedStyle(
	document.querySelector('.element'), ':before'
).getPropertyValue('content');
```

你可以在我之前的关于[设备状态检测](http://davidwalsh.name/device-state-detection-css-media-queries-javascript)的博文中看到如何访问content属性值。如果你想要创建动态而独特的站点，这会相当有用的！

### classList API

在我们心仪的JavaScript库中我们都用过`addClass`、`removeClass`和`toggleClass`方法。为了兼容旧式浏览器，每个库都会抓取元素的`className`（字符串格式），然后追加/删除class，然后更新`className`字符串。有一个新的API用来添加、删除和切换class，它就是[classList](http://davidwalsh.name/classlist)。

``` javascript
myDiv.classList.add('myCssClass'); // Adds a class

myDiv.classList.remove('myCssClass'); // Removes a class

myDiv.classList.toggle('myCssClass'); // Toggles a class
```

*译注：还有contains API：*

``` javascript
alert(div.classList.contains("foo"));
```

*更多内容参见：[https://developer.mozilla.org/en-US/docs/Web/API/Element.classList#Browser_compatibility](https://developer.mozilla.org/en-US/docs/Web/API/Element.classList#Browser_compatibility)*

`classList`在大多数浏览器中已经早就被实现了，但是IE直到IE 10才提供该API。

### 直接给样式表添加和删除规则

我们都会很熟练地通过`element.style.propertyName`方法来修改样式，也使用过JavaScript工具箱来完成，但你是否知道事实上你可以[直接读写新的和已存在的样式表规则](http://davidwalsh.name/add-rules-stylesheets)？事实上这个API也非常简单！

``` javascript
function addCSSRule(sheet, selector, rules, index) {
	if(sheet.insertRule) {
		sheet.insertRule(selector + "{" + rules + "}", index);
	}
	else {
		sheet.addRule(selector, rules, index);
	}
}

// Use it!
addCSSRule(document.styleSheets[0], "header", "float: left");
```

最常见的使用场景就是创建一个新的样式表，但如果你想要修改一个已有的样式表，它就派上用场啦！

### 使用加载器加载CSS文件

针对图片、JSON和脚本这些资源做懒加载是降低加载时间的很好的办法。我们可以使用像curl.js这样的JavaScript加载器来加载这些外部资源，但你是否知道可以[懒加载样式表](http://davidwalsh.name/curljs)并且同样在回调函数中收到加载完成的通知？

``` javascript
curl(
	[
		"namespace/MyWidget",
		"css!namespace/resources/MyWidget.css"
	], 
	function(MyWidget) {
		// Do something with MyWidget
		// The CSS reference isn't in the signature because we don't care about it;
		// we just care that it is now in the page
	}
});
```

这个博客懒加载了PrismJS，它是一个依赖`pre`元素的语法高亮器。一旦所有的资源文件都加载了，包括样式表，我就可以触发一个回调函数。很有用吧！

### CSS `pointer-events`

[CSS的`pointer-events`](http://davidwalsh.name/pointer-events)属性有意思的地方在于它在行为上表现得像是JavaScript脚本，当值为`none`的时候可以直接禁用一个元素，如果值不为`none`的时候就会允许这个元素正常地工作。也许你会说“那又如何呢？！”但是`pointer-events`甚至会阻止JavaScript事件触发！

``` css
.disabled { pointer-events: none; }
```

点击那个元素，你在这个元素上绑定的任何`addEventListener`回调都*不会*触发。事实上这是一个很棒的属性——你不必在根据class的值决定是否触发什么之前执行`className`检查。

*译注：经测试ie系都无效，Chrome和Firefox下有效，不考虑兼容性的情况下可以考虑使用，另该属性只会阻止当前节点成为鼠标事件的目标，但并不意味着该元素上鼠标事件监听器不会触发。如果它的子元素的`pointer-events`显式设为`allow`，同样可以通过冒泡的方式触发该元素监听事件。详见[pointer-events](https://developer.mozilla.org/en-US/docs/Web/CSS/pointer-events)*

这些就是5种也许你不会经常想到的CSS和JavaScript打交道的方式。还有更多的想法？请和大家分享吧！