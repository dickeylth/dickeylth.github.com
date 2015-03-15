title: '[译]Creating A Simple Restful Web App with Node.js, Express, and MongoDB'
date: 2014-02-10 11:35:01
tags: ['Node.js', 'RESTful']
---

去年Nicholas C. Zakas大神发表了一篇名为[Node.js and the new web front-end](http://www.nczonline.net/blog/2013/10/07/node-js-and-the-new-web-front-end/)的博文（译文见[【译】Node.js 给前端带来了什么](http://blog.silverna.org/~posts/JavaScript/2013-10-09-node-js-and-the-new-web-front-end.md)），介绍了他对于Node.js的出现对前后端分工协作的一种设想的新方案，博文中提到的很重要的关键词之一就是`RESTful`了，国内目前玉伯大大所在的支付宝团队也正尝试将Node.js引入作为前后端协作的桥梁。这篇文章详细介绍了如何使用Node.js、Express和MongoDB实现一个简单的基于restful接口设计的Web app的开发过程，让我们一起来学习下。

<!--more-->

## 用Node.js、Express和MongoDB创建一个简单的基于restful的web app

*学习rest的基本知识并用以构建一个简单、快速的单页面Web App。*

作者：[Christopher Buecheler](http://cwbuecheler.com/)
	

>[你可以从GitHub上找到/fork示例项目](https://github.com/cwbuecheler/node-tutorial-2-restful-app)


在[我的第一篇教程](http://cwbuecheler.com/web/tutorials/2013/node-express-mongo/)中，我们学习了如何从无到有创建一个功能完备的Node.js web app，使用Express框架通过MongoDB数据库读写数据。那是个不错的开始，如果你还不熟悉那些技术，是时候浏览那份教程了，因为接下来我们即将深入研究了。你需要知道如何使用Express使web服务器运行起来，以及如何使用app.get和app.post与服务器和数据库打交道。这些在那篇教程中都有介绍，如果你是一位熟悉JavaScript的开发者，对你来说应该不会太难。[去看看吧！](http://cwbuecheler.com/web/tutorials/2013/node-express-mongo/)

看完回来了？。。。还是轻蔑地翻翻白眼说，“老兄，我早就知道这些东西了”？不管怎样，太棒了！让我们往工具箱里加点新玩意儿，创建一个简单的无需页面刷新的小应用。我们的目标是：

* 学习REST的通俗意思
* 使用HTTP POST和HTTP GET保存和读取MongoDB集合中的JSON格式数据
* 使用HTTP DELETE从集合中删除数据
* 使用AJAX完成数据操作
* 使用jQuery更新DOM

在第一篇教程中，基于Router/View模式的后端之上，我们基本上构建了一个简单的的前端应用。在这篇教程中，我们将要干掉页面刷新或是访问单独的URI的需要。一切都将迎刃而解。但在开始构建之前，让我们先来点REST...

### 第一部分 - 说正经的，到底REST是什么？

维基百科上将表征状态转移(Representational State Transfer, REST)定义为：一种对分布式超媒体系统中的架构元素进行抽象的软件架构风格。大家明白了吗？我们都清楚了，可以继续了吗？

。。。不太明白？

是的，我也不太明白。我不知道分布式超媒体系统是什么玩意儿，我也大可承认这一点。让我们试着用更通俗的语言来表述REST的概念。为此，我们要从[IBM的developerWorks网站](http://www.ibm.com/developerworks/webservices/library/ws-restful/)（中文版：[基于 REST 的 Web 服务：基础](http://www.ibm.com/developerworks/cn/webservices/ws-restful/)）引用4条基本的设计原则，并解释它们是什么意思。

- 显式地使用 HTTP 方法。
- 无状态。
- 公开目录结构式的 URI。
- 传输 XML、JavaScript Object Notation (JSON)，或同时传输这两者。

#### 显式地使用 HTTP 方法

这一条相当直观。我们使用GET检索数据，使用POST创建数据，使用PUT（本教程中没有用到）更新或修改数据，使用DELETE删除数据。因此，作为示例，下面这个曾经常见的方法就不是个好主意：

>http://www.domain.com/myservice/newuser.php?newuser=bob

这是一个伪装为POST的HTTP GET请求，在GET网页的同时向其传入数据存到数据库中。正确的做法是创建一个NewUser服务并将数据POST给它来取而代之。

#### 无状态

这是一个有点复杂的概念，但可以简单归结为“不要在服务器上存储状态信息”。如果你非得存储状态，在客户端通过cookies或其他方法来保存。像Angular（超出本教程的介绍范围了，但是请保持关注！）这样的前端框架这时就特别有用，它可以创建一个完整的客户端MVC设置，你不必惊动你的服务器就能保存和操作元素的状态。

IBM那个网页上提供了一个很好的分页的例子。在有状态的设计中，传递页面的服务会跟踪你所在的页面，并返回下一页。在无状态的设计中，通过在HTML标记（隐藏input域、JavaScript变量、`data-`属性等）中填充上一页、当前页和下一页数据并以HTTP GET请求访问newPage服务，同时传入标记中的下一页参数来请求特定页。

我已经将这些东西组合到[一个简短的JSFiddle示例](http://jsfiddle.net/cwbuecheler/7fars/)中，来说明我在谈论什么。稍微看看，注意我们决不在“服务器”端存储任何关于所在页面的数据。我们只是从DOM中拿到当前是第几页，然后当获取新页面后更新DOM。这就是简单的无状态编程。

#### 公开目录结构式的 URI

这一条很简单，相比

>http://app.com/getfile.php?type=video&game=skyrim&pid=68

你更想要的会是

>http://app.com/files/video/skyrim/68

#### 传输 XML、JavaScript Object Notation (JSON)，或同时传输这两者

这一条也很简单！只需要确保你的后端程序发送的是XML或是JSON格式数据（我更喜欢JSON，尤其是在像本教程中讨论的这种纯JavaScript配置环境中）。你可以很轻松地在表现层操作数据，而不必与服务器交互，除非你需要获取新的数据。

OK。。。那么我们都基本明白了REST的概念了吗？它是非常直观的，真的。也许你已经在与用到它的系统打交道了。

### 第二部分 - 设置

既然我们已经知道了关于REST的基本概念，让我们通过构建一个比较傻瓜的几乎没啥用的简单的单页web app来加以应用。有点像硅谷中一半的创业公司正在干的，不是吗？这种事还在继续吗？

不管怎样，不，我们不打算构建任务清单，虽然这已经是web app的“Hello World”级的入门程序了。我们将要构建一个简单的用户名和邮箱的集合，很像我们之前的教程中那样。但是，需要设置一些东西，并且我们不再依赖于Monk。我们将切换到使用Mongoskin来管理MongoDB。为啥？嗯，首先，在过去1年内Monk的Github页面几乎没有什么重要的提交，这使我很紧张。其次，Mongoskin很轻量级，不需要像Mongoose那样定义模式，而且相比Monk功能更为全面。语法上几乎是一致的。

那么，让我们开始吧。确认你的机器上已经安装了最新的稳定版的Node，然后打开控制台窗口导航到你要存放web项目的位置，对于这份教程而言是`C:\node\`。如果你要将项目放到其他位置（比如说/home或是/Users），作出相应调整。

首先我们要做的是更新全局的Express，像下面这样：

``` bash
npm update express -g
```

执行完成后，输入下面的命令：

``` bash
express nodetest2
```

如果你还记得之前教程中的介绍，就知道这条命令将会自动在一个新的名为nodetest2的目录下生成一个网站的骨架。在命令执行过程中保持关注，执行完成后，在你选择的文本编辑器中打开新创建的package.json文件（在新创建的nodetest2文件夹下），然后改成下面的样子：

``` javascript
{
  'name': 'application-name',
  'version': '0.0.1',
  'private': true,
  'scripts': {
    'start': 'node app.js'
  },
  'dependencies': {
    'express': '3.4.8',
    'jade': '*',
    'mongodb': '*',
    'mongoskin': '*'
  }
}
```

“*”意思是“只管给我最新版的”，基本上就可以满足你的需要了。注意，我们加入了MongoDB和Mongoskin包从而可以访问和控制数据库。回到命令行提示符，**`cd`到你的notest2目录**，输入：

``` bash
npm install
```

所有的依赖项会逐一安装——得花点时间。感觉很兴奋！然后，还有件小事需要做。同样在命令提示符下，输入：

``` bash
mkdir data
```

这是我们存放数据库文件的位置，稍后我们会再次提到。如果你想存到别的地方，也完全OK……只需要知道，你需要在运行MongoDB前准备好这个目录。就是这样；后面我们会在教程中预填充数据库，现在我们已经完成了配置了。是时候开始创建web页面了。

最后需要注意的一点：本文全部使用2空格缩进，因为这是Express的骨架中的默认设置。事实上工作中大多时候我都用tab缩进。我知道这一点很有争议，但老实说，鉴于在任何像样的编辑器中将空格转为tab都很快速而简单，我不觉得这是个问题。你尽可以如你所愿作出选择，除非你的团队中达成了一致约定。

### 第三部分 - 开始着手HTML

如果我们要做一个单页web app，首先需要的是一个单页面，对吧？让我们打开视图文件夹，开始着手layout.jade。我们将对这个模板文件只要稍作修改。下面是开始的部分：

``` jade
doctype html
html
  head
    title= title
    link(rel='stylesheet', href='/stylesheet/style.css')
  body
    block content
```

我们想要做2件事。一，引入jQuery；二，引入我们的主JavaScript文件。那么，让我们来编辑这个文件，使它变成像这样：

``` jade
doctype html
html
  head
    title= title
    link(rel='stylesheet', href='/stylesheet/style.css')
  body
    block content
    <script src='http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js'></script>
   - <script src='/javascripts/global.js'></script>
```

机智的读者会注意到global.js实际上还不存在。这是对的。等会儿我们就会创建它。目前为止，当我们加载首页，这个文件的请求仅仅会在后台静默地返回了404。如果你确实不爽，尽可以现在就在/public/javascripts目录下创建一个空的global.js文件。

回到index.jade——这是我们的整个web app中所需的唯一的HTML文件。我们将要在这个页面上放置相当多的东西。在现实场景中，我们还需要很多CSS，但为了节省时间，直接[下载这个文件](http://cwbuecheler.com/web/tutorials/2014/restful-web-app-node-express-mongodb/style.css)并复制到/public/stylesheets/style.css。这个样式表可以给你提供一个基本的布局，你可以随心所欲地修改它来美化页面。

打开index.jade。你可以看到一个**相当**基础的骨架：

``` jade
extends layout

block content
  h1= title
  p Welcome to #{title}
```

这不太令人兴奋。让我们开始修改它吧。`h1= title`这一行，以及后面的p
对应的段落，都提取了/routes/index.js中的`title`变量，也就是“Express”。这有点重复了，让我们修改这个段落，只输出“Welcome to our test”。然后让我们添加一个包装器，以及一个表格骨架用来展示用户列表：

``` jade
extends layout

block content
  h1= title
  p Welcome to our test

  // Wrapper
  #wrapper

    // USER LIST
    h2 User List
    #userList
      table
        thead
          th UserName
          th Email
          th Delete?
        tbody
    // /USER LIST

  // /WRAPPER
```

你会注意到，表格中没有数据。这是因为我们将要借助AJAX从MongoDB数据库中拉取出数据来填充表格。那么，让我们来搞定这一步，然后写点JavaScript把一切处理好。

如果你想看看现在这个页面长什么样子了，去终端输入下面的命令：

``` bash
node app.js
```

然后导航到[http://localhost:3000/](http://localhost:3000/)，你就可以看到一个非常基础而无趣的页面，上面有一个空的表格。如果你下载了上面提到的CSS文件并覆盖了默认的样式表，就会长这个样子：

![](http://cwbuecheler.com/web/tutorials/2014/restful-web-app-node-express-mongodb/restful_web_app_screenshot_01.png)

挺令人兴奋的，对吗？事实上还不够。让我们使它可以做点什么。

### 第四部分 - 数据库

在之前的教程中，我们已经讲到了MongoDB的设置和运行，因此这里我将直接跳到有用的东西。开启一个**新的**终端或是命令行提示符窗口，导航到你安装MongoDB的位置（例如：C:\mongo），然后输入：

``` bash
mongod --dbpath c:\node\nodetest2\data
```

显然，如果之前你觉得把数据存放到别的地方，替换为使用那个路径。你应该会看到MongoDB守护进程启动并报告正在等待连接。让我们来连接MongoDB:打开一个**新的**终端/命令行窗口，导航到Mongo目录，输入：

``` bash
mongo
```

现在我们就进入了数据库的命令行界面。这在之前的教程中也讨论过了，因此我会再次直接跳到“立即动手”而不再解释。让我们输入下面的命令切换到一个新的数据库（用于我们的新项目）：

``` bash
use nodetest2
```

现在我们要创建并填充我们的nodetest2数据库中的“userlist”集合。我们将像下面这样一下子插入一些数据到这个空的集合中：

``` javascript
db.userlist.insert({'username' : 'test1','email' : 'test1@test.com','fullname' : 'Bob Smith','age' : 27,'location' : 'San Francisco','gender' : 'Male'})
```

注意：我习惯在将这行代码归结为单行输入到MongoDB控制台之前，首先在文本编辑器中使用tab和所有其他的格式进行编辑，这样我就可以看清楚写的是否有问题。你也可以选择你最喜欢的做法。

这就是这次我们需要预填充的所有的数据了。**实际上**我们甚至不必做到这种份上，因为不论怎样我们将要创建一个增加用户的程序，但这样更容易看到，当我们开始接通应用前，是的，我们的数据库连接正常工作中。

现在你可以退出MongoDB控制台并关闭终端了，但确保MongoDB的守护程序保持运转。如果你关闭了守护程序，我们的站点就无法连接数据库了，那就会很糟糕了。

### 第五部分 - 列出用户

现在该开始修改app.js了，它是我们的应用的心脏和灵魂。Express默认已经将它设置得挺好了，但我们还需要添加一些Mongoskin的钩子。我们将从下面这段代码开始：

``` javascript
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/user', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
```

我们将要在顶端的模块依赖部分添加一点东西，改成像这样：

``` javascript
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user')
var http = require('http');
var path = require('path');
// Database
var mongo = require('mongoskin');
var db = mongo.db([
    'localhost:27017/?auto_reconnect'
    ], {
        database: 'nodetest2',
        safe: true
    }
);
```

这里，我们调用了Mongoskin模块，然后向其传入一些基本的配置参数（包括告知数据库访问位置，以及要使用的数据库——nodetest2）。

注意，Express自动创建了一个/user路由文件。我们将会用到这个文件，但不会为它创建任何视图。为什么？嗯，因为既然这是单页面应用，我们将使用Index路由和视图来展示。我们将使用user路由来设置数据输入输出——也就是我们想要创建用来从数据库获取、添加和删除用户的服务。我们将使用JavaScript完成这些，而不是在浏览器中通过导航跳转的方式，并在index页面展示集合中的数据。

所以为此，让我们做一点清理工作。在文本编辑器中打开/nodetest2/route/user.js。它应该像下面这样：

``` javascript
/*
 * GET users listing.
 */

exports.list = function(req, res){
    res.send('respond with a resource');
};
```

直接删除这些内容，是所有的，我们不再需要这些了。我们将要写点自己的东西。实际上，让我先写一个从MongoDB中抓取数据的程序，用来填充页面上的表格。还是在/routes/user.js中，添加下面的代码：

``` javascript
/*
 * GET userlist page.
 */

exports.userlist = function(db) {
  return function(req, res) {
    db.collection('userlist').find().toArray(function (err, items) {
      res.json(items);
    })
  }
};
```

这段代码的目的是：如果你执行一个HTTP GET请求到/userlist，服务器就会返回以JSON格式列出数据库中所有用户。显然，对于大型项目，你会想要给一次抓取的数据的数量设定限制，例如通过在前端添加分页，但在我们的这个项目中这就可以了。

现在我们需要将其关联到我们的应用中。保持user.js，然后在文本编辑器中打开/nodetest2/app/js。在该文件的底部，添加我们的路由的调用：

``` javascript
app.get('/', routes.index);
app.get('/user', user.list);
```

我们可以删除第二个。我们已经从user路由文件中删除了原有的list函数，所以我们也应该从app.js中删除调用。现在我们想要给我们的自定义的userlist函数添加调用。

让我们在app.js中添加调用。app.get部分现在应该改成像这样：

``` javascript
app.get('/', routes.index);
app.get('/userlist', user.userlist(db));
```

保存app.js文件，如果node实例还在运行中，杀掉该实例然后在终端重启：

``` bash 
node app.js
```

然后刷新浏览器，你就可以看到……啥也看不到。额，不是啥也没有，而是和上面的屏幕截图中一模一样。这是因为我们还没有把一切接通。如果你想看看，可以导航到[http://localhost:3000/userlist](http://localhost:3000/userlist)，你就会看到我们下一步将要操作的JSON输出。只有一个用户，也就是之前我们在MongoDB控制台手工输入的用户。

让我们把这个用户放到HTML中吧？现在我们将要创建自己的global.js文件了，创建一个新的文本文档并保存到/nodetest2/public/javascript/global.js。

在我的编码风格中有几点需要注意：我喜欢使用括号，即使对于单行的if语句也是。我喜欢有意义的变量名而不是尽可能短的变量名。相比双引号我更倾向于单引号，相比在代码右边写注释我更倾向于在代码上面一行写注释。我用了很多注释，因为JS总是会被压缩的，所以真的没有必要担心注释会增加文件体积。出于同样的理由我也使用了很多空格。噢，我还喜欢将开括号放在同一行而非新行。

也许你不赞同我的风格中的某一条或某几条。没关系。采用你认为合适的风格。重要的是你的代码的可读性（如果你在与他人协作开发）以及代码可以正常运行（无论如何）。

让我们以定义一个用来