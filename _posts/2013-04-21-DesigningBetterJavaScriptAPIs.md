---
layout: post
title: 设计更好的JavaScript API
category: '翻译'
tags: 'JavaScript API'
---

# {{ page.title }}

By Rodney Rehm

原文链接：[http://coding.smashingmagazine.com/2012/10/09/designing-javascript-apis-usability/](http://coding.smashingmagazine.com/2012/10/09/designing-javascript-apis-usability/)

**某些时候，你会发现你自己写的JavaScript代码比一个jQuery插件代码行数更多。你的代码需要做一大堆的工作，（理想情况下）它会被许多以不同方式访问你的代码的人所使用。他们拥有不同的需求、学识和期望。**

![Time Spend with The Library](http://media.smashingmagazine.com/wp-content/uploads/2012/10/Pie-chart.jpg "Time Spend on Creating/Using The Library")

本文讨论了在你编写你自己的应用和库之前和期间需要考虑的一些重要的事情。我们将关注于如何使你的代码对其他开发者*易于理解*。虽然在示例中会有很多话题论及jQuery，然而这篇文章既不是关于jQuery也不是关于为jQuery编写插件。

Perter Drucker曾经说过：“计算机是个白痴”。不要为白痴写代码，为人而写吧！让我们展开讨论如何设计开发者们会喜欢使用的API。

## 目录
* 连贯接口
* 一致性
* 处理参数
* 可扩展性
* 钩子机制
* 生成访问器
* 引用之怖
* 连续性问题
* 处理错误
* 处理异步
* 调试连贯接口
* 文档化API
* 结论