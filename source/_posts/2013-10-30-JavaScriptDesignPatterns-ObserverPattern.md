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

![生活中的策略模式](/img/jspatterns/observer-examples.png)

比如，路口的红绿灯，行人和车辆都需要观察灯的状态的变化等候或通过；做饭时，比如油烧开了该放葱蒜了、水烧开了该放面条了；双11来了，到了秒杀的时间点了，我们就该出手了。这些都是对象之间监听其他对象的状态执行自定义的方法的例子。

### 如何实现

当页面中模块相互相对独立，交互比较简单的时候观察者模式发挥的作用还不太明显，但是对于复杂表单的处理，尤其各模块之间存在耦合关系时，此时观察者模式就会大有用武之地了。让我们看看淘宝旅行的机票订单页：

![淘宝旅行机票订单页](/img/jspatterns/observer-examples/observer-flight.png)

看上去这个表单比较小清新，但是小清新的背后却对于前端架构提出了更高的要求。可以看到，仅仅是“添加一位乘机人”这个操作，就需要多个模块对其进行监听并执行相应的操作。对于这个页面的详细的前端架构的解剖可以参阅陶清的[《复杂表单应用解耦，淘宝机票订单实践》](http://ued.taobao.org/blog/?p=6366)，虽然并不是同一个页面，但新版的订单页也是基于之前国际机票订单页的基础之上进行扩展的，基础的架构都还是比较一致的。

下面让我们使用原生的JavaScript来简单模拟一下其中的注册/发布模式：

<a class="jsbin-embed" href="http://jsbin.com/AmilUmUh/1/embed?js,console">JS Bin</a><script src="http://static.jsbin.com/js/embed.js"></script>

在这里我们创建了一个`GlobalEvent`对象来对各个模块的注册/发布进行统一管理，发布者-事件类型-观察者之间构成了一个M:N:M的双重多对多的关系，即发布者和事件类型之间是多对多的关系，而事件类型与观察者之间又是多对多的关系。对于`GlobalEvent`而言，本身并不关心发布者，它只负责在被发布者调用其`publish`方法时，查询已经注册过该发布事件类型的所有观察者，然后依次调用观察者给定的方法。





下面让我们以一个策略模式最常应用的场景之一——表单验证为例来看看策略模式的实现。通常对于一个表单，各个字段的输入值可能格式不一，有的是数字，有的是字符串，有的是电话号码，还有的可能是密码、邮箱等等，因而它们可能各自都有验证的要求，但策略其实又是有限可复用的，比如多个字段可能都要求验证非空。这时我们就可以把常见的验证策略抽象为一个策略集合，使用者需要对表单数据进行校验时，只需要传入数据以及指定各个字段的验证策略，就可以给出相应的验证结果了，从而将表单的处理和验证逻辑分离开来，期望的调用结果可能是这样：

{% codeblock lang:javascript %}
// 待校验的数据
var data = {
    name: '王x',
    gender: 1,
    identity: '011110198806061234',
    birthday: '1988-13-01',
    mobile: '15800000000',
    spareMobile: '13911111111',
    email: 'abcdef.cn'
};

// 校验规则配置
validator.config = {
    name: {
        text: '姓名',
        validators: ['isNotEmpty', 'isValidName']
    },
    identity: {
        text: '身份证号',
        validators: ['isNotEmpty','isValidIdentity']
    },
    birthday: {
        text: '生日',
        validators: [['isBirthEqualTo','identity'],'isValidDate']
    },
    mobile: {
        text: '手机号码',
        validators: ['isValidMobile']
    },
    spareMobile: {
        text: '备用手机号码',
        validators: ['isValidMobile', ['isNotEqualTo', 'mobile']]
    },
    email: {
        text: 'Email',
        validators: ['isValidEmail']
    }
};

// 调用获得校验结果
validator.validate(data);
if(validator.hasErrors()){
    validator.messages.join('<br/>');
}
//期望结果：
/*
姓名只能为2-4个字的汉字
生日与身份证号不一致，请修改
生日格式不合法，请按"2008-01-01"格式输入日期
备用手机号码不得与手机号码相同，请重新输入
Email格式不合法，请输入正确的Email地址
*/
{% endcodeblock %}

下面我们来看看该如何实现上面的核心的`validator`对象，针对每种校验策略，我们需要指定校验方法和校验失败时的错误提示，这些策略可以挂载到`validator`对象内部方便管理：

{% codeblock lang:javascript %}
// 所有可用的校验
validator.types = {

    isNotEmpty: {
        validate: function(value){
            return value !== "";
        },
        message: "不得为空"
    },

    isNotEqualTo: {
        validate: function(data, curField, compareField){
            return data[curField] === data[compareField];
        },
        message: function(fieldText){
            return "不得与" + fieldText + "相同，请重新输入";
        }
    },

    isValidName: {
        validate: function(value){
            return /^[\u4e00-\u9fa5]{2,4}$/.test(value);
        },
        message: "只能为2-4个字的汉字"
    },

    ...

};
{% endcodeblock %}

这里`isNotEqualTo`方法略微复杂一些，因为为了校验数据中2个字段是否相同，除了需要当前字段的值，还需要获得待比较字段的值，因而配置起来会稍微麻烦一点。

完整的`validator`对象就可以实现为以下形式：

<a class="jsbin-embed" href="http://jsbin.com/uzEtEDu/1/embed?js,console">JS Bin</a><script src="http://static.jsbin.com/js/embed.js"></script>

当以后表单中字段有新增，如果出现了需要验证的新的策略，只需要将其加入到`validator.types`下，然后在`validator.config`中添加校验规则，代码其他部分就不需要再进行调整了，依然执行`validator.validate`方法，一切仍会按预期给出校验结果。

### 在开源框架和类库中的应用

策略模式似乎看上去应用场景往往和具体的业务逻辑结合比较紧，在开源框架和类库中并不太容易找到算得上的应用。不过我们可以看看KISSY中的[uploader](http://gallery.kissyui.com/uploader/1.5/guide/index.html)这个插件，其特性之一是“支持ajax、flash、iframe三种方案，兼容所有浏览器”，并且在设置中指定上传的`type`，这可以看作是一种策略模式的实现了。我们看看[源代码部分](https://github.com/kissygalleryteam/uploader/blob/master/1.5/index.js)：

{% codeblock lang:javascript %}
    /**
     * 获取上传方式
     * @param {String} type 上传方式（根据type返回对应的上传类，比如iframe返回IframeType）
     */
    _getType:function (type) {
        var self = this, types = Uploader.type, UploadType,
            isSupportAjax = self.isSupportAjax(),
            isSupportFlash = self.isSupportFlash();
        switch (type) {
            case types.IFRAME :
                UploadType = IframeType;
                break;
            case types.AJAX :
                UploadType = isSupportAjax && AjaxType || false;
                break;
            case types.FLASH :
                UploadType = isSupportFlash && FlashType || false;
                break;
            default :
                S.log(LOG_PREFIX + 'type参数不合法');
                return false;
        }
        if (UploadType) S.log(LOG_PREFIX + '使用' + type + '上传方式');
        self.set('type', type);
        return UploadType;
    },
{% endcodeblock %}

而在代码组织上，我们可以看到：

{% codeblock lang:javascript %}
/**
 * @fileoverview 异步文件上传组件
 * @author 剑平（明河）<minghe36@126.com>,紫英<daxingplay@gmail.com>
 **/
KISSY.add(function (S, Node, RichBase,JSON,UA,IframeType, AjaxType, FlashType, HtmlButton, SwfButton, Queue) {
    ...
}, {requires:['node', 'rich-base','json', 'ua','./type/iframe', './type/ajax', './type/flash', ...]
});
{% endcodeblock %}

可见，将3种上传方式的具体实现单独放到type下对应模块中，实现了模块化，从而支持了客户端代码调用时的按需选择指定的上传方式。这就可以看作是一种策略模式的实现了。

### 总结

策略模式对于有多种可提炼出较为通用的算法，并在不同的使用场景中可能会按需选择某一种或某几种策略完成对应的业务逻辑时比较有用。所以如果当你的程序中涉及到类似的一些场景，如业务逻辑涉及到分类和按需应用时，就可以考虑一下策略模式来实现算法和调用的解耦。