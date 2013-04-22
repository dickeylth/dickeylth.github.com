---
layout: post
title: 你好，世界
---
## {{ page.title }}

我的第一篇文章

{% highlight javascript%}

	function demo(){
		var i = 10;
		console.log('abc');
	}

{% endhighlight %}

# Less学习笔记
-----------------------------------

## 概况
### 变量
- 一处定义，多处使用

### Mixins
- 嵌入其他类下的属性
- 可作为函数来用，接收参数（可设默认值）
- 多种样式之间存在继承关系时

### 嵌套规则
- 选择器嵌套
- 继承关系清晰，样式表更短

**注意对伪类的继承写法**：

	a { text-decoration: none;
      	&:hover { border-width: 1px }
    }

### 函数&操作符
- 处理*数值*的加减乘除调整设值
- 以括号执行操作
- 函数与JavaScript代码一一映射

示例：

	// LESS
	@base-color: #111;
	@red:        #842210;

	#footer {
	  color: (@base-color + #003300);
	  border-color: desaturate(@red, 10%);
	}

{{ page.date | date_to_string }}