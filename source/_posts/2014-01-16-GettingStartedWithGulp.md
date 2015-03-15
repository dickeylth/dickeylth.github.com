---
layout: post
title: "[译]Getting Started With Gulp"
category: '翻译' 
tags: ['Gulp']
cover: "/img/jspatterns/observer-cover.jpg"
---

原文：[Getting Started With Gulp](http://travismaynard.com/writing/getting-started-with-gulp?utm_source=javascriptweekly&utm_medium=email)

本文假定你从未使用过任务运行器或命令行界面，将按照要求一步步学习和运行gulp。

<!--more-->

好消息是事实上gulp相当简单！我将通过5个基本步骤，引导您完成所有令人生畏的东西，并介绍使用gulp之前您需要了解的核心概念。让我们开始吧！

### 第一步 - 安装Node

首先——Node是必不可少的。只需要访问[http://nodejs.org](http://nodejs.org)并点击绿色的大“安装”按钮就可以安装Node了。下载结束后，执行该应用程序，一切就准备就绪了。Node安装器也包含了npm，稍后我们会再提到它。

### 第二步 - 认识命令行

目前你可能还不太熟悉命令行界面（OS X下的终端，Windows下的命令提示符），但很快你就会了！起初可能看上去有些令人生畏，但一旦你熟悉了，你就可以执行很多各种各样的命令行应用程序了，比如[Sass](http://sass-lang.com/)、[Yeoman](http://yeoman.io/)、[Git](http://git-scm.com/)等。这些都是非常有用的工具，对提升您工作流效率很有益处！

{% blockquote %}
如果你已经很熟悉命令行界面了，可以直接跳到第四步。
{% endblockquote %}

举一个简单例子，打开命令行，让我们输入几个命令以验证Node是否安装成功了。

``` bash
node -v
```
输入上面的命令然后单击回车，就可以在下一行看到当前安装的Node的版本号。

现在，让我们对npm执行同样的命令

``` bash
npm -v
```

同样地，下一行会显示npm的版本号。

如果没有响应输出，那可能是Node没有安装成功，或者你可能需要重新启动命令行程序。如果重启后问题依然存在，那就直接回到页头，从第一步重新来过。

### 第三步 - 导航到项目文件夹

现在我们已经见识了命令行界面，而且也知道了如何与其交互，接下来将要通过它来导航到各处。幸运的是，切换文件夹和查看文件夹内容只需要2个命令。这些命令包括用来列出目录下所有文件的`ls`（Windows下的`dir`）和用来切换目录的`cd`。

{% blockquote %}
我想你会花点时间来和这些命令打交道。熟悉文件系统并且弄清楚哪些东西在哪儿。不要囫囵吞枣地匆忙结束这部分——稍后你会轻松得多。
{% endblockquote %}

当你熟悉了`ls`和`cd`命令后，接下来我们需要导航到项目文件夹。这里可能会因人而异，我会输入以下的命令来导航到我的本地项目，供你参考：

``` bash
cd /Applications/XAMPP/xamppfiles/htdocs/my-project
```

{% blockquote %}
需要注意的是我是在OS X上操作。Windows下的文件系统则是大相径庭，虽然与上面有些类似，但不能直接在Windows下使用。
{% endblockquote %}

一旦你成功导航到项目文件夹，我们就可以开始安装gulp了！

### 第四步 - 安装gulp

你已经认识了知道如何与命令行对话了，甚至已经熟悉了你的文件系统。现在，是时候说些有意思的东西了。让我们来认识npm，以及gulp的安装！

NPM代表*Node Package Manager*，它是一个命令行工具，使你可以安装额外的Node包到你的项目中。它甚至有个[很棒的站点](http://npmjs.org/)使你可以浏览和搜索所有可用的包。

在命令行程序中输入：

``` bash
sudo npm install -g gulp
```

让我们快速地分解一下这行命令：

1. `sudo`命令用来授予管理员身份访问，从而使你可以正确安装文件。它会要求你输入计算机密码。（这也许是不必要的，但没关系。我已经将其列入授权命令，以避免其他人可能会遇到的权限问题。）
2. `npm`是我们用来安装包的应用程序。
3. 我们在运行该应用程序的`install`命令。
4. `-g`是一个*可选的*标识，用来明确表示我们希望将这个包安装到全局，从而其他的项目也可以使用它。
5. 最后，`gulp`是我们想要安装的包的名字。

一旦命令开始执行，你需要对命令行滚动提示进行过程检查，确保没有报错信息。如果没有看到任何报错信息，祝贺你！你已经安装成功了gulp了！为了复查一下，让我们回顾一下上面对Node和npm执行的版本号查看的命令。

``` bash
gulp -v
```

和之前一样，将会在命令行的下一行返回版本号。

接下来，我们需要安装gulp到本地。

``` bash
npm install --save-dev gulp
```
这里唯一不同之处是使用了`--save-dev`标识，指示npm添加依赖到`package.json`文件中的`devDependencies`列表中。

依赖关系帮助我们组织开发和生产环境中各自需要用到的包。对于依赖如果你想了解更多，一定要看看[package.json 文档](https://npmjs.org/doc/json.html#dependencies)。

现在gulp安装好了，下一步就是配置gulpfile。我们很快就会搞定了！

### 第五步 - 配置gulpfile和运行gulp

gulp安装成功后，我们需要提供一些指示，告知它我们需要执行的任务。但首先，我们需要搞清楚在我们的项目需要执行哪些任务。让我们来看……一个场景。

在我们的*Exciting Non-Generic Real World Scenario*（令人兴奋的非泛型现实世界场景...），老板给我们布置了下面的任务：

- 对JavaScript执行代码检查(lint)。（说真的，做一下）
- 编译Sass文件。（浏览器无法处理这种文件）
- 连接JavaScript。（减少HTTP请求！）
- 压缩和重命名上面的连接后的文件。（不放过一点一滴！）

BlaBla...为了不让老板发狂，让我们在午餐被吃点前搞定它！

#### 安装必要的插件

``` bash
npm install gulp-jshint gulp-sass gulp-concat gulp-uglify gulp-rename --save-dev
```

这一步将会安装上所需的所有插件，并将它们添加到`package.json`文件的`devDependencies`列表中，就像上一步安装gulp中一样。

{% blockquote %}
友情提示，如果安装插件时遇到了权限错误，也许你需要在这串命令前添加上`sudo`！
{% endblockquote %}

#### 创建gulpfile

既然插件准备就绪了，我们可以开始编写gulpfile，以指示gulp执行老板安排给我们的任务。

在我们走进代码之前，我觉得很有必要提一下，gulp只有**5个方法**。这些方法如下：`task`、`run`、`watch`、`src`和`dest`。这些就是你编写任务所需的全部东西了。

在你的项目根目录创建一个新文件，命名为gulpfile.js，然后粘贴以下的代码到其中：

gulpfile.js
``` javascript
// Include gulp
var gulp = require('gulp'); 

// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// Lint Task
gulp.task('lint', function() {
    gulp.src('./js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
    gulp.src('./scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./css'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    gulp.src('./js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
});

// Default Task
gulp.task('default', function(){
    gulp.run('lint', 'sass', 'scripts');

    // Watch For Changes To Our JS
    gulp.watch('./js/*.js', function(){
        gulp.run('lint', 'scripts');
    });

    // Watch For Changes To Our SCSS
    gulp.watch('./scss/*.scss', function(){
        gulp.run('sass');
    });
});
```

现在，让我们逐步拆解和检查每部分都做些什么。

#### 核心和插件

``` javascript
// Include gulp
var gulp = require('gulp'); 

// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
```

这里引入了核心的gulp和将要执行的任务相关的插件。接下来，对每个独立的任务进行配置。这些任务有**lint**、**sass**、**scripts**、**default**。

#### lint任务

``` javascript
// Lint Task
gulp.task('lint', function() {
    gulp.src('./js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});
```

**lint**任务检查`js/`目录下的所有JavaScript文件，确保代码中没有任何错误。

#### sass任务

``` javascript
// Compile Our Sass
gulp.task('sass', function() {
    gulp.src('./scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./css'));
});
```
**sass**任务将`scss/`目录下所有的Sass文件编译为`.css`文件，并将这些编译后的css文件保存到`css/`目录下。

#### scripts任务

``` javascript
// Concatenate & Minify JS
gulp.task('scripts', function() {
    gulp.src('./js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
});
```
**scripts**任务将`js/`目录下的所有JavaScript文件连接起来，并将输出保存到`dist/`目录下。gulp接收连接后的文件，对其压缩、重命名并同样保存到`dist/`目录下。

#### default任务

``` javascript
// Default Task
gulp.task('default', function(){
    gulp.run('lint', 'sass', 'scripts');

    // Watch For Changes To Our JS
    gulp.watch('./js/*.js', function(){
        gulp.run('lint', 'scripts');
    });

    // Watch For Changes To Our SCSS
    gulp.watch('./scss/*.scss', function(){
        gulp.run('sass');
    });
});
```

最后，还有**default**任务，只是将其他任务进行包装。它使用`.run()`方法来引用和执行上面定义的任务。`.watch()`方法是用来持续检查在指定目录下是否有文件更新，如果有，就会执行回调中引用到的任务。

现在，唯一剩下的任务就是执行gulp。切换回命令行，输入：

``` bash
gulp
```

这会调用gulp并执行**default**任务中定义的所有代码。因此，换句话说和执行下面的命令是一样的效果：

``` bash
gulp default
```

另外，并非只能执行默认任务，也可以随时执行之前定义的任何任务。只需要调用gulp然后直接指定接下来你想要执行的任务。例如，我们可以像下面这样随时手动执行sass任务：

``` bash
gulp sass
```

相当酷，对吧？

### 总结

好了，你已经完成了。BlaBla...搞定了可怕的老板神马的可以吃午餐休息下了。让我们做一下快速回顾，看看我们都学到了什么：

1. 学习了如何安装Node
2. 认识了命令行
3. 学习了如何在命令行中漫游
4. 学习了如何使用npm和安装gulp
5. 学习了如何编写gulpfile和运行gulp

希望通过这个介绍使任务运行器更易于理解，也可以让你发现gulp为你的项目和开发工作流带来的真实的价值。如果你有更多的问题，一定要在评论中留下！

### 继续阅读

和往常一样，有一些额外的资源很棒，尤其是本文中我们未能详细涉及到的细节。OK，下面这些资源将带领你到本文范围之外，你应该去看看：

- [npm上的gulp插件](https://npmjs.org/search?q=gulpplugin)
- [Github上的gulp](https://github.com/wearefractal/gulp)
- [官方package.json文档](https://npmjs.org/doc/json.html)

感谢[@eschoff](https://twitter.com/eschoff)和[@BlaineBublitz](https://twitter.com/BlaineBublitz)审核本文以及代码示例。