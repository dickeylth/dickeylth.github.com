---
layout: post
title: "JavaScript中的设计模式(4)——策略模式"
category: '笔记' 
tags: ['JavaScript设计模式']
cover: "/img/jspatterns/strategy-cover.jpg"
---


策略模式支持在运行时由使用者选择合适的算法，对于使用者而言不用关心背后的具体实现，由使用者自动根据当前程序执行的上下文和配置，从已有的算法列表中选择出合适的算法来处理当然任务。

<!--more-->

## 目录
+ 要解决的问题
+ 如何实现
+ 在开源框架和类库中的应用
+ 总结

### 要解决的问题

策略模式同样解决的是解耦的问题，目的是使调用的客户端与需要调用的算法解耦开来，保证算法的内部实现的更改不会影响到客户端的调用。当然这些算法往往需要封装为较为通用的。这样一来客户端可以自由地从算法集中选取需要调用的合适的算法，就像搭积木一样，而算法也可以独立出来单测。

生活中又有哪些策略模式的应用呢?看看下面的图：

![生活中的策略模式](/img/jspatterns/strategy-examples.png)

在画图中，根据选择的刷子种类不同，我们可以刷出不同样式的线条出来。但各种刷子背后的实现机制使我们不需要关心的，我们只需要关心当前画图中需要应用哪种刷子。对于下面的商品促销也是类似的，促销的策略有多种，会直接影响到最终的订单计价，每种商品可能促销方式是折扣，也可能是直减，也可能是满减，最后优惠券的使用可能也会影响到符合条件的商品订单的总价，这时采用策略模式其实就和业务需求比较吻合。

### 如何实现

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

<a class="jsbin-embed" href="http://jsbin.com/uzEtEDu/2/embed?js,console">JS Bin</a><script src="http://static.jsbin.com/js/embed.js"></script>

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