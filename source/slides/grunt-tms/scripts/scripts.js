/*! Bespoke.js v0.4.0 © 2014 Mark Dalgleish, Licensed MIT */
!function(a,b){var c=function(b,c){var h=1===b.nodeType?b:document.querySelector(b),i=[].filter.call(h.children,function(a){return"SCRIPT"!==a.nodeName}),j=i[0],k={},l=function(a,b){i[a]&&(q("deactivate",r(j,b)),j=i[a],i.map(m),q("activate",r(j,b)),f(j,"active"),g(j,"inactive"))},m=function(a,b){var c=b-i.indexOf(j),d=c>0?"after":"before";["before(-\\d+)?","after(-\\d+)?","active","inactive"].map(g.bind(null,a)),a!==j&&["inactive",d,d+"-"+Math.abs(c)].map(f.bind(null,a))},n=function(a,b){return arguments.length?(q("slide",r(i[a],b))&&l(a,b),void 0):i.indexOf(j)},o=function(a,b){var c=i.indexOf(j)+a;q(a>0?"next":"prev",r(j,b))&&l(c,b)},p=function(a,b){return(k[a]||(k[a]=[])).push(b),function(){k[a]=k[a].filter(function(a){return a!==b})}},q=function(a,b){return(k[a]||[]).reduce(function(a,c){return a&&c(b)!==!1},!0)},r=function(a,b){return b=b||{},b.index=i.indexOf(a),b.slide=a,b},s={on:p,fire:q,slide:n,next:o.bind(null,1),prev:o.bind(null,-1),parent:h,slides:i};f(h,"parent"),i.map(function(a){f(a,"slide")});for(var t in c){if(!e[t])throw Error("Missing plugin: "+a+"-"+t);c[t]!==!1&&e[t](s,c[t])}return l(0),d.push(s),s},d=[],e={},f=function(b,c){b.classList.add(a+"-"+c)},g=function(b,c){b.className=b.className.replace(RegExp(a+"-"+c+"(\\s|$)","g")," ").trim()},h=function(a){return function(){var b=arguments;d.map(function(c){c[a].apply(null,b)})}};b[a]={from:c,slide:h("slide"),next:h("next"),prev:h("prev"),plugins:e}}("bespoke",window);
/*! bespoke-keys v0.1.0 © 2013 Mark Dalgleish, Licensed MIT */
bespoke.plugins.keys=function(a,b){var c=b===!0||"horizontal"==b;document.addEventListener("keydown",function(b){(34==b.which||32==b.which||c&&39==b.which||!c&&40==b.which)&&a.next(),(33==b.which||c&&37==b.which||!c&&38==b.which)&&a.prev()})};
/*! bespoke-touch v0.1.0 © 2013 Mark Dalgleish, Licensed MIT */
bespoke.plugins.touch=function(a,b){var c,d,e=b===!0||"horizontal"==b?"X":"Y";a.parent.addEventListener("touchstart",function(a){1==a.touches.length&&(c=a.touches[0]["page"+e],d=0)}),a.parent.addEventListener("touchmove",function(a){1==a.touches.length&&(a.preventDefault(),d=a.touches[0]["page"+e]-c)}),a.parent.addEventListener("touchend",function(){Math.abs(d)>50&&(d>0?a.prev():a.next())})};
/*! bespoke-bullets v0.2.1 © 2013 Mark Dalgleish, Licensed MIT */
(function(e){e.plugins.bullets=function(e,t){var n,r,i=e.slides.map(function(e){return[].slice.call(e.querySelectorAll(typeof t=="string"?t:"[data-bespoke-bullet]"),0)}),s=function(){var e=n+1;if(a(1))return u(n,r+1),!1;i[e]&&u(e,0)},o=function(){var e=n-1;if(a(-1))return u(n,r-1),!1;i[e]&&u(e,i[e].length-1)},u=function(e,t){n=e,r=t,i.forEach(function(n,r){n.forEach(function(n,i){n.classList.add("bespoke-bullet"),r<e||r===e&&i<=t?(n.classList.add("bespoke-bullet-active"),n.classList.remove("bespoke-bullet-inactive")):(n.classList.add("bespoke-bullet-inactive"),n.classList.remove("bespoke-bullet-active"))})})},a=function(e){return i[n][r+e]!==undefined};e.on("next",s),e.on("prev",o),e.on("slide",function(e){u(e.index,0)}),u(0,0)}})(bespoke);
/*! bespoke-scale v0.2.0 © 2013 Mark Dalgleish, Licensed MIT */
!function(a){a.plugins.scale=function(a,b){var c=a.parent,d=a.slides[0],e=d.offsetHeight,f=d.offsetWidth,g="zoom"===b||"zoom"in c.style&&"transform"!==b,h=function(a){var b=document.createElement("div");return b.className="bespoke-scale-parent",c.insertBefore(b,a),b.appendChild(a),b},i=g?a.slides:a.slides.map(h),j=function(a){var b="Moz Webkit O ms".split(" ");return b.reduce(function(b,d){return d+a in c.style?d+a:b},a.toLowerCase())}("Transform"),k=g?function(a,b){b.style.zoom=a}:function(a,b){b.style[j]="scale("+a+")"},l=function(){var a=c.offsetWidth/f,b=c.offsetHeight/e;i.forEach(k.bind(null,Math.min(a,b)))};window.addEventListener("resize",l),l()}}(bespoke);
/*! bespoke-hash v0.1.2 © 2013 Mark Dalgleish, Licensed MIT */
(function(e){e.plugins.hash=function(e){var t,n=function(){var t=window.location.hash.slice(1),n=parseInt(t,10);t&&(n?r(n-1):e.slides.forEach(function(e,n){e.getAttribute("data-bespoke-hash")===t&&r(n)}))},r=function(n){n!==t&&e.slide(n)};setTimeout(function(){n(),e.on("activate",function(e){var n=e.slide.getAttribute("data-bespoke-hash");window.location.hash=n||e.index+1,t=e.index}),window.addEventListener("hashchange",n)},0)}})(bespoke);
/*! bespoke-progress v0.1.0 © 2013 Mark Dalgleish, Licensed MIT */
!function(a){a.plugins.progress=function(a,b){var c=document.createElement("div"),d=document.createElement("div"),e="vertical"===b?"height":["horizontal",!0].indexOf(b)+1?"width":void 0;e&&(c.className="bespoke-progress-parent",d.className="bespoke-progress-bar",c.appendChild(d),a.parent.appendChild(c),a.on("activate",function(b){d.style[e]=100*b.index/(a.slides.length-1)+"%"}))}}(bespoke);
/*! bespoke-state v0.2.2 © 2013 Mark Dalgleish, Licensed MIT */
(function(e){e.plugins.state=function(e){var t=function(t,n){var r=n.slide.getAttribute("data-bespoke-state");r&&r.split(" ").forEach(function(n){n&&e.parent.classList[t](n)})};e.on("activate",t.bind(null,"add")),e.on("deactivate",t.bind(null,"remove"))}})(bespoke);
/*! bespoke-forms v0.1.0 © 2013 Mark Dalgleish, Licensed MIT */
!function(a){a.plugins.forms=function(a){a.slides.forEach(function(a){a.addEventListener("keydown",function(a){(/INPUT|TEXTAREA|SELECT/.test(a.target.nodeName)||"true"===a.target.contentEditable)&&a.stopPropagation()})})}}(bespoke);
/* Modernizr 2.6.2 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-cssanimations-csstransitions-touch-shiv-cssclasses-prefixed-teststyles-testprop-testallprops-prefixes-domprefixes-load
 */
;window.Modernizr=function(a,b,c){function z(a){j.cssText=a}function A(a,b){return z(m.join(a+";")+(b||""))}function B(a,b){return typeof a===b}function C(a,b){return!!~(""+a).indexOf(b)}function D(a,b){for(var d in a){var e=a[d];if(!C(e,"-")&&j[e]!==c)return b=="pfx"?e:!0}return!1}function E(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:B(f,"function")?f.bind(d||b):f}return!1}function F(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+o.join(d+" ")+d).split(" ");return B(b,"string")||B(b,"undefined")?D(e,b):(e=(a+" "+p.join(d+" ")+d).split(" "),E(e,b,c))}var d="2.6.2",e={},f=!0,g=b.documentElement,h="modernizr",i=b.createElement(h),j=i.style,k,l={}.toString,m=" -webkit- -moz- -o- -ms- ".split(" "),n="Webkit Moz O ms",o=n.split(" "),p=n.toLowerCase().split(" "),q={},r={},s={},t=[],u=t.slice,v,w=function(a,c,d,e){var f,i,j,k,l=b.createElement("div"),m=b.body,n=m||b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:h+(d+1),l.appendChild(j);return f=["&#173;",'<style id="s',h,'">',a,"</style>"].join(""),l.id=h,(m?l:n).innerHTML+=f,n.appendChild(l),m||(n.style.background="",n.style.overflow="hidden",k=g.style.overflow,g.style.overflow="hidden",g.appendChild(n)),i=c(l,a),m?l.parentNode.removeChild(l):(n.parentNode.removeChild(n),g.style.overflow=k),!!i},x={}.hasOwnProperty,y;!B(x,"undefined")&&!B(x.call,"undefined")?y=function(a,b){return x.call(a,b)}:y=function(a,b){return b in a&&B(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=u.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(u.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(u.call(arguments)))};return e}),q.touch=function(){var c;return"ontouchstart"in a||a.DocumentTouch&&b instanceof DocumentTouch?c=!0:w(["@media (",m.join("touch-enabled),("),h,")","{#modernizr{top:9px;position:absolute}}"].join(""),function(a){c=a.offsetTop===9}),c},q.cssanimations=function(){return F("animationName")},q.csstransitions=function(){return F("transition")};for(var G in q)y(q,G)&&(v=G.toLowerCase(),e[v]=q[G](),t.push((e[v]?"":"no-")+v));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)y(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof f!="undefined"&&f&&(g.className+=" "+(b?"":"no-")+a),e[a]=b}return e},z(""),i=k=null,function(a,b){function k(a,b){var c=a.createElement("p"),d=a.getElementsByTagName("head")[0]||a.documentElement;return c.innerHTML="x<style>"+b+"</style>",d.insertBefore(c.lastChild,d.firstChild)}function l(){var a=r.elements;return typeof a=="string"?a.split(" "):a}function m(a){var b=i[a[g]];return b||(b={},h++,a[g]=h,i[h]=b),b}function n(a,c,f){c||(c=b);if(j)return c.createElement(a);f||(f=m(c));var g;return f.cache[a]?g=f.cache[a].cloneNode():e.test(a)?g=(f.cache[a]=f.createElem(a)).cloneNode():g=f.createElem(a),g.canHaveChildren&&!d.test(a)?f.frag.appendChild(g):g}function o(a,c){a||(a=b);if(j)return a.createDocumentFragment();c=c||m(a);var d=c.frag.cloneNode(),e=0,f=l(),g=f.length;for(;e<g;e++)d.createElement(f[e]);return d}function p(a,b){b.cache||(b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag()),a.createElement=function(c){return r.shivMethods?n(c,a,b):b.createElem(c)},a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+l().join().replace(/\w+/g,function(a){return b.createElem(a),b.frag.createElement(a),'c("'+a+'")'})+");return n}")(r,b.frag)}function q(a){a||(a=b);var c=m(a);return r.shivCSS&&!f&&!c.hasCSS&&(c.hasCSS=!!k(a,"article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}")),j||p(a,c),a}var c=a.html5||{},d=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,e=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,f,g="_html5shiv",h=0,i={},j;(function(){try{var a=b.createElement("a");a.innerHTML="<xyz></xyz>",f="hidden"in a,j=a.childNodes.length==1||function(){b.createElement("a");var a=b.createDocumentFragment();return typeof a.cloneNode=="undefined"||typeof a.createDocumentFragment=="undefined"||typeof a.createElement=="undefined"}()}catch(c){f=!0,j=!0}})();var r={elements:c.elements||"abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",shivCSS:c.shivCSS!==!1,supportsUnknownElements:j,shivMethods:c.shivMethods!==!1,type:"default",shivDocument:q,createElement:n,createDocumentFragment:o};a.html5=r,q(b)}(this,b),e._version=d,e._prefixes=m,e._domPrefixes=p,e._cssomPrefixes=o,e.testProp=function(a){return D([a])},e.testAllProps=F,e.testStyles=w,e.prefixed=function(a,b,c){return b?F(a,b,c):F(a,"pfx")},g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(f?" js "+t.join(" "):""),e}(this,this.document),function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))};
/*! bespoke-fx v0.0.0 © 2014 Tim Churchward, Licensed MIT */
BespokeFx={init:function(a,b){this.deck=a,this.direction=b.direction?b.direction:"horizontal",this.default_axis=this.getAxisFromDirection(this.direction),this.animEndEventName=this.animEndEventNames[Modernizr.prefixed("animation")],this.transition=b.transition?b.transition:"move",this.reverse=b.reverse?b.reverse:!1},getAxisFromDirection:function(a){return"vertical"==a?"Y":"X"},fx:{move:{X:{next:"move-to-left-from-right",prev:"move-to-right-from-left"},Y:{next:"move-to-top-from-bottom",prev:"move-to-bottom-from-top"}},"move-fade":{X:{next:"fade-from-right",prev:"fade-from-left"},Y:{next:"fade-from-bottom",prev:"fade-from-top"}},"move-both-fade":{X:{next:"fade-left-fade-right",prev:"fade-right-fade-left"},Y:{next:"fade-top-fade-bottom",prev:"fade-bottom-fade-top"}},"move-different-easing":{X:{next:"different-easing-from-right",prev:"different-easing-from-left"},Y:{next:"different-easing-from-bottom",prev:"different-easing-from-top"}},"scale-down-out-move-in":{X:{next:"scale-down-from-right",prev:"move-to-right-scale-up"},Y:{next:"scale-down-from-bottom",prev:"move-to-bottom-scale-up"}},"move-out-scale-up":{X:{next:"move-to-left-scale-up",prev:"scale-down-from-left"},Y:{next:"move-to-top-scale-up",prev:"scale-down-from-top"}},"scale-up-up":{X:{next:"scale-up-scale-up",prev:"scale-down-scale-down"},Y:{next:"scale-up-scale-up",prev:"scale-down-scale-down"}},"scale-down-up":{X:{next:"scale-down-scale-up",prev:"scale-down-scale-up"},Y:{next:"scale-down-scale-up",prev:"scale-down-scale-up"}},glue:{X:{next:"glue-left-from-right",prev:"glue-right-from-left"},Y:{next:"glue-top-from-bottom",prev:"glue-bottom-from-top"}},flip:{X:{next:"flip-left",prev:"flip-right"},Y:{next:"flip-top",prev:"flip-bottom"}},fall:{X:{next:"fall",prev:"fall"},Y:{next:"fall",prev:"fall"}},newspaper:{X:{next:"newspaper",prev:"newspaper"},Y:{next:"newspaper",prev:"newspaper"}},push:{X:{next:"push-left-from-right",prev:"push-right-from-left"},Y:{next:"push-top-from-bottom",prev:"push-bottom-from-top"}},pull:{X:{next:"push-left-pull-right",prev:"push-right-pull-left"},Y:{next:"push-bottom-pull-top",prev:"push-top-pull-bottom"}},fold:{X:{next:"fold-left-from-right",prev:"move-to-right-unfold-left"},Y:{next:"fold-bottom-from-top",prev:"move-to-top-unfold-bottom"}},unfold:{X:{next:"move-to-left-unfold-right",prev:"fold-right-from-left"},Y:{next:"move-to-bottom-unfold-top",prev:"fold-top-from-bottom"}},room:{X:{next:"room-to-left",prev:"room-to-right"},Y:{next:"room-to-bottom",prev:"room-to-top"}},cube:{X:{next:"cube-to-left",prev:"cube-to-right"},Y:{next:"cube-to-bottom",prev:"cube-to-top"}},carousel:{X:{next:"carousel-to-left",prev:"carousel-to-right"},Y:{next:"carousel-to-bottom",prev:"carousel-to-top"}},sides:{X:{next:"sides",prev:"sides"},Y:{next:"sides",prev:"sides"}},slide:{X:{next:"slide",prev:"slide"},Y:{next:"slide",prev:"slide"}}},animations:{"move-to-left-from-right":{id:1,group:"move",label:"Move to left / from right",outClass:"fx-slide-moveToLeft",inClass:"fx-slide-moveFromRight",reverse:"move-to-right-from-left"},"move-to-right-from-left":{id:2,group:"move",label:"Move to right / from left",outClass:"fx-slide-moveToRight",inClass:"fx-slide-moveFromLeft",reverse:"move-to-left-from-right"},"move-to-top-from-bottom":{id:3,group:"move",label:"Move to top / from bottom",outClass:"fx-slide-moveToTop",inClass:"fx-slide-moveFromBottom",reverse:"move-to-bottom-from-top"},"move-to-bottom-from-top":{id:4,group:"move",label:"Move to bottom / from top",outClass:"fx-slide-moveToBottom",inClass:"fx-slide-moveFromTop",reverse:"move-to-top-from-bottom"},"fade-from-right":{id:5,group:"fade",label:"Fade / from right",outClass:"fx-slide-fade",inClass:"fx-slide-moveFromRight fx-slide-ontop",reverse:"fade-from-left"},"fade-from-left":{id:6,group:"fade",label:"Fade / from left",outClass:"fx-slide-fade",inClass:"fx-slide-moveFromLeft fx-slide-ontop",reverse:"fade-from-right"},"fade-from-bottom":{id:7,group:"fade",label:"Fade / from bottom",outClass:"fx-slide-fade",inClass:"fx-slide-moveFromBottom fx-slide-ontop",reverse:"fade-from-top"},"fade-from-top":{id:8,group:"fade",label:"Fade / from top",outClass:"fx-slide-fade",inClass:"fx-slide-moveFromTop fx-slide-ontop",reverse:"fade-from-bottom"},"fade-left-fade-right":{id:9,group:"fade",label:"Fade left / Fade right",outClass:"fx-slide-moveToLeftFade",inClass:"fx-slide-moveFromRightFade",reverse:"fade-right-fade-left"},"fade-right-fade-left":{id:10,group:"fade",label:"Fade right / Fade left",outClass:"fx-slide-moveToRightFade",inClass:"fx-slide-moveFromLeftFade",reverse:"fade-left-fade-right"},"fade-top-fade-bottom":{id:11,group:"fade",label:"Fade top / Fade bottom",outClass:"fx-slide-moveToTopFade",inClass:"fx-slide-moveFromBottomFade",reverse:"fade-bottom-fade-top"},"fade-bottom-fade-top":{id:12,group:"fade",label:"Fade bottom / Fade top",outClass:"fx-slide-moveToBottomFade",inClass:"fx-slide-moveFromTopFade",reverse:"fade-top-fade-bottom"},"different-easing-from-right":{id:13,group:"different-easing",label:"Different easing / from right",outClass:"fx-slide-moveToLeftEasing fx-slide-ontop",inClass:"fx-slide-moveFromRight",reverse:"different-easing-from-left"},"different-easing-from-left":{id:14,group:"different-easing",label:"Different easing / from left",outClass:"fx-slide-moveToRightEasing fx-slide-ontop",inClass:"fx-slide-moveFromLeft",reverse:"different-easing-from-right"},"different-easing-from-bottom":{id:15,group:"different-easing",label:"Different easing / from bottom",outClass:"fx-slide-moveToTopEasing fx-slide-ontop",inClass:"fx-slide-moveFromBottom",reverse:"different-easing-from-top"},"different-easing-from-top":{id:16,group:"different-easing",label:"Different easing / from top",outClass:"fx-slide-moveToBottomEasing fx-slide-ontop",inClass:"fx-slide-moveFromTop",reverse:"different-easing-from-bottom"},"scale-down-from-right":{id:17,group:"scale",label:"Scale down / from right",outClass:"fx-slide-scaleDown",inClass:"fx-slide-moveFromRight fx-slide-ontop",reverse:"move-to-right-scale-up"},"scale-down-from-left":{id:18,group:"scale",label:"Scale down / from left",outClass:"fx-slide-scaleDown",inClass:"fx-slide-moveFromLeft fx-slide-ontop",reverse:"move-to-left-scale-up"},"scale-down-from-bottom":{id:19,group:"scale",label:"Scale down / from bottom",outClass:"fx-slide-scaleDown",inClass:"fx-slide-moveFromBottom fx-slide-ontop",reverse:"move-to-bottom-scale-up"},"scale-down-from-top":{id:20,group:"scale",label:"Scale down / from top",outClass:"fx-slide-scaleDown",inClass:"fx-slide-moveFromTop fx-slide-ontop",reverse:"move-to-top-scale-up"},"scale-down-scale-down":{id:21,group:"scale",label:"Scale down / scale down",outClass:"fx-slide-scaleDown",inClass:"fx-slide-scaleUpDown fx-slide-delay300",reverse:"scale-up-scale-up"},"scale-up-scale-up":{id:22,group:"scale",label:"Scale up / scale up",outClass:"fx-slide-scaleDownUp",inClass:"fx-slide-scaleUp fx-slide-delay300",reverse:"scale-down-scale-down"},"move-to-left-scale-up":{id:23,group:"scale",label:"Move to left / scale up",outClass:"fx-slide-moveToLeft fx-slide-ontop",inClass:"fx-slide-scaleUp",reverse:"scale-down-from-left"},"move-to-right-scale-up":{id:24,group:"scale",label:"Move to right / scale up",outClass:"fx-slide-moveToRight fx-slide-ontop",inClass:"fx-slide-scaleUp",reverse:"scale-down-from-right"},"move-to-top-scale-up":{id:25,group:"scale",label:"Move to top / scale up",outClass:"fx-slide-moveToTop fx-slide-ontop",inClass:"fx-slide-scaleUp",reverse:"scale-down-from-top"},"move-to-bottom-scale-up":{id:26,group:"scale",label:"Move to bottom / scale up",outClass:"fx-slide-moveToBottom fx-slide-ontop",inClass:"fx-slide-scaleUp",reverse:"scale-down-from-bottom"},"scale-down-scale-up":{id:27,group:"scale",label:"Scale down / scale up",outClass:"fx-slide-scaleDownCenter",inClass:"fx-slide-scaleUpCenter fx-slide-delay400",reverse:"scale-down-scale-up"},"glue-left-from-right":{id:28,group:"rotate:glue",label:"Glue left / from right",outClass:"fx-slide-rotateRightSideFirst",inClass:"fx-slide-moveFromRight fx-slide-delay200 fx-slide-ontop",reverse:"glue-right-from-left"},"glue-right-from-left":{id:29,group:"rotate:glue",label:"Glue right / from left",outClass:"fx-slide-rotateLeftSideFirst",inClass:"fx-slide-moveFromLeft fx-slide-delay200 fx-slide-ontop",reverse:"glue-left-from-right"},"glue-bottom-from-top":{id:30,group:"rotate:glue",label:"Glue bottom / from top",outClass:"fx-slide-rotateTopSideFirst",inClass:"fx-slide-moveFromTop fx-slide-delay200 fx-slide-ontop",reverse:"glue-top-from-bottom"},"glue-top-from-bottom":{id:31,group:"rotate:glue",label:"Glue top / from bottom",outClass:"fx-slide-rotateBottomSideFirst",inClass:"fx-slide-moveFromBottom fx-slide-delay200 fx-slide-ontop",reverse:"glue-bottom-from-top"},"flip-right":{id:32,group:"rotate:flip",label:"Flip right",outClass:"fx-slide-flipOutRight",inClass:"fx-slide-flipInLeft fx-slide-delay500",reverse:"flip-left"},"flip-left":{id:33,group:"rotate:flip",label:"Flip left",outClass:"fx-slide-flipOutLeft",inClass:"fx-slide-flipInRight fx-slide-delay500",reverse:"flip-right"},"flip-top":{id:34,group:"rotate:flip",label:"Flip top",outClass:"fx-slide-flipOutTop",inClass:"fx-slide-flipInBottom fx-slide-delay500",reverse:"flip-bottom"},"flip-bottom":{id:35,group:"rotate:flip",label:"Flip bottom",outClass:"fx-slide-flipOutBottom",inClass:"fx-slide-flipInTop fx-slide-delay500",reverse:"flip-top"},fall:{id:36,group:"rotate",label:"Fall",outClass:"fx-slide-rotateFall fx-slide-ontop",inClass:"fx-slide-scaleUp",reverse:"fall"},newspaper:{id:37,group:"rotate",label:"Newspaper",outClass:"fx-slide-rotateOutNewspaper",inClass:"fx-slide-rotateInNewspaper fx-slide-delay500",reverse:"newspaper"},"push-left-from-right":{id:38,group:"rotate:push-pull",label:"Push left / from right",outClass:"fx-slide-rotatePushLeft",inClass:"fx-slide-moveFromRight",reverse:"push-right-from-left"},"push-right-from-left":{id:39,group:"rotate:push-pull",label:"Push right / from left",outClass:"fx-slide-rotatePushRight",inClass:"fx-slide-moveFromLeft",reverse:"push-left-from-right"},"push-top-from-bottom":{id:40,group:"rotate:push-pull",label:"Push top / from bottom",outClass:"fx-slide-rotatePushTop",inClass:"fx-slide-moveFromBottom",reverse:"push-bottom-from-top"},"push-bottom-from-top":{id:41,group:"rotate:push-pull",label:"Push bottom / from top",outClass:"fx-slide-rotatePushBottom",inClass:"fx-slide-moveFromTop",reverse:"push-top-from-bottom"},"push-left-pull-right":{id:42,group:"rotate:push-pull",label:"Push left / pull right",outClass:"fx-slide-rotatePushLeft",inClass:"fx-slide-rotatePullRight fx-slide-delay180",reverse:"push-right-pull-left"},"push-right-pull-left":{id:43,group:"rotate:push-pull",label:"Push right / pull left",outClass:"fx-slide-rotatePushRight",inClass:"fx-slide-rotatePullLeft fx-slide-delay180",reverse:"push-left-pull-right"},"push-top-pull-bottom":{id:44,group:"rotate:push-pull",label:"Push top / pull bottom",outClass:"fx-slide-rotatePushTop",inClass:"fx-slide-rotatePullBottom fx-slide-delay180",reverse:"push-bottom-pull-top"},"push-bottom-pull-top":{id:45,group:"rotate:push-pull",label:"Push bottom / pull top",outClass:"fx-slide-rotatePushBottom",inClass:"fx-slide-rotatePullTop fx-slide-delay180",reverse:"push-top-pull-bottom"},"fold-left-from-right":{id:46,group:"rotate:fold-unfold",label:"Fold left / from right",outClass:"fx-slide-rotateFoldLeft",inClass:"fx-slide-moveFromRightFade",reverse:"move-to-right-unfold-left"},"fold-right-from-left":{id:47,group:"rotate:fold-unfold",label:"Fold right / from left",outClass:"fx-slide-rotateFoldRight",inClass:"fx-slide-moveFromLeftFade",reverse:"move-to-left-unfold-right"},"fold-top-from-bottom":{id:48,group:"rotate:fold-unfold",label:"Fold top / from bottom",outClass:"fx-slide-rotateFoldTop",inClass:"fx-slide-moveFromBottomFade",reverse:"move-to-bottom-unfold-top"},"fold-bottom-from-top":{id:49,group:"rotate:fold-unfold",label:"Fold bottom / from top",outClass:"fx-slide-rotateFoldBottom",inClass:"fx-slide-moveFromTopFade",reverse:"move-to-top-unfold-bottom"},"move-to-right-unfold-left":{id:50,group:"rotate:fold-unfold",label:"Move to right / unfold left",outClass:"fx-slide-moveToRightFade",inClass:"fx-slide-rotateUnfoldLeft",reverse:"fold-left-from-right"},"move-to-left-unfold-right":{id:51,group:"rotate:fold-unfold",label:"Move to left / unfold right",outClass:"fx-slide-moveToLeftFade",inClass:"fx-slide-rotateUnfoldRight",reverse:"fold-right-from-left"},"move-to-bottom-unfold-top":{id:52,group:"rotate:fold-unfold",label:"Move to bottom / unfold top",outClass:"fx-slide-moveToBottomFade",inClass:"fx-slide-rotateUnfoldTop",reverse:"fold-top-from-bottom"},"move-to-top-unfold-bottom":{id:53,group:"rotate:fold-unfold",label:"Move to top / unfold bottom",outClass:"fx-slide-moveToTopFade",inClass:"fx-slide-rotateUnfoldBottom",reverse:"fold-bottom-from-top"},"room-to-left":{id:54,group:"rotate:room",label:"Room to left",outClass:"fx-slide-rotateRoomLeftOut fx-slide-ontop",inClass:"fx-slide-rotateRoomLeftIn",reverse:"room-to-right"},"room-to-right":{id:55,group:"rotate:room",label:"Room to right",outClass:"fx-slide-rotateRoomRightOut fx-slide-ontop",inClass:"fx-slide-rotateRoomRightIn",reverse:"room-to-left"},"room-to-top":{id:56,group:"rotate:room",label:"Room to top",outClass:"fx-slide-rotateRoomTopOut fx-slide-ontop",inClass:"fx-slide-rotateRoomTopIn",reverse:"room-to-bottom"},"room-to-bottom":{id:57,group:"rotate:room",label:"Room to bottom",outClass:"fx-slide-rotateRoomBottomOut fx-slide-ontop",inClass:"fx-slide-rotateRoomBottomIn",reverse:"room-to-top"},"cube-to-left":{id:58,label:"Cube to left",outClass:"fx-slide-rotateCubeLeftOut fx-slide-ontop",inClass:"fx-slide-rotateCubeLeftIn",reverse:"cube-to-right"},"cube-to-right":{id:59,label:"Cube to right",outClass:"fx-slide-rotateCubeRightOut fx-slide-ontop",inClass:"fx-slide-rotateCubeRightIn",reverse:"cube-to-left"},"cube-to-top":{id:60,label:"Cube to top",outClass:"fx-slide-rotateCubeTopOut fx-slide-ontop",inClass:"fx-slide-rotateCubeTopIn",reverse:"cube-to-bottom"},"cube-to-bottom":{id:61,label:"Cube to bottom",outClass:"fx-slide-rotateCubeBottomOut fx-slide-ontop",inClass:"fx-slide-rotateCubeBottomIn",reverse:"cube-to-top"},"carousel-to-left":{id:62,group:"rotate:carousel",label:"Carousel to left",outClass:"fx-slide-rotateCarouselLeftOut fx-slide-ontop",inClass:"fx-slide-rotateCarouselLeftIn",reverse:"carousel-to-right"},"carousel-to-right":{id:63,group:"rotate:carousel",label:"Carousel to right",outClass:"fx-slide-rotateCarouselRightOut fx-slide-ontop",inClass:"fx-slide-rotateCarouselRightIn",reverse:"carousel-to-left"},"carousel-to-top":{id:64,group:"rotate:carousel",label:"Carousel to top",outClass:"fx-slide-rotateCarouselTopOut fx-slide-ontop",inClass:"fx-slide-rotateCarouselTopIn",reverse:"carousel-to-bottom"},"carousel-to-bottom":{id:65,group:"rotate:carousel",label:"Carousel to bottom",outClass:"fx-slide-rotateCarouselBottomOut fx-slide-ontop",inClass:"fx-slide-rotateCarouselBottomIn",reverse:"carousel-to-top"},sides:{id:66,group:"rotate",label:"Sides",outClass:"fx-slide-rotateSidesOut",inClass:"fx-slide-rotateSidesIn fx-slide-delay200",reverse:"sides"},slide:{id:67,label:"Slide",outClass:"fx-slide-rotateSlideOut",inClass:"fx-slide-rotateSlideIn",reverse:"slide"}},animEndEventNames:{WebkitAnimation:"webkitAnimationEnd",OAnimation:"oAnimationEnd",msAnimation:"MSAnimationEnd",animation:"animationend"},addClassNames:function(a,b){for(var c=b.split(" "),d=0;d<c.length;d++)a.classList.add(c[d])},removeClassNames:function(a,b){for(var c=b.split(" "),d=0;d<c.length;d++)a.classList.remove(c[d])},prev:function(a){if(a.index>0&&!a.transition_complete){var b=a.slide,c=this.deck.slides[a.index-1];this.doTransition(b,c,"prev")}},next:function(a){if(a.index<this.deck.slides.length-1){var b=a.slide,c=this.deck.slides[a.index+1];this.doTransition(b,c,"next")}},slide:function(a){if(a.slide){var b=this.deck.slide(),c=this.deck.slides[b],d=a.index,e=a.slide,f=d>b?"next":"prev";this.doTransition(c,e,f)}},doTransition:function(a,b,c){var d=b.getAttribute("data-bespoke-fx-direction")?this.getAxisFromDirection(b.getAttribute("data-bespoke-fx-direction")):this.default_axis;(this.reverse||"true"===b.getAttribute("data-bespoke-fx-reverse"))&&(c="next"===c?"prev":"next");var e=b.getAttribute("data-bespoke-fx-transition"),f=e?this.fx[e][d]:this.fx[this.transition][d],g=f[c],h=this.animations[g].outClass,i=this.animations[g].inClass,j=this;a.addEventListener(this.animEndEventName,function(a){j.removeClassNames(a.target,h+" fx-transitioning-out")}),b.addEventListener(this.animEndEventName,function(a){j.removeClassNames(a.target,i+" fx-transitioning-in")}),this.addClassNames(a,h+" fx-transitioning-out"),this.addClassNames(b,i+" fx-transitioning-in")}},function(a,b){a.plugins.fx=function(a,c){b.init(a,c),a.on("next",b.next.bind(b)),a.on("prev",b.prev.bind(b)),a.on("slide",b.slide.bind(b))}}(bespoke,BespokeFx);


/* **********************************************
     Begin prism-core.js
********************************************** */

/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license http://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou http://lea.verou.me
 */

(function(){

// Private helper vars
var lang = /\blang(?:uage)?-(?!\*)(\w+)\b/i;

var _ = self.Prism = {
	util: {
		type: function (o) { 
			return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
		},
		
		// Deep clone a language definition (e.g. to extend it)
		clone: function (o) {
			var type = _.util.type(o);

			switch (type) {
				case 'Object':
					var clone = {};
					
					for (var key in o) {
						if (o.hasOwnProperty(key)) {
							clone[key] = _.util.clone(o[key]);
						}
					}
					
					return clone;
					
				case 'Array':
					return o.slice();
			}
			
			return o;
		}
	},
	
	languages: {
		extend: function (id, redef) {
			var lang = _.util.clone(_.languages[id]);
			
			for (var key in redef) {
				lang[key] = redef[key];
			}
			
			return lang;
		},
		
		// Insert a token before another token in a language literal
		insertBefore: function (inside, before, insert, root) {
			root = root || _.languages;
			var grammar = root[inside];
			var ret = {};
				
			for (var token in grammar) {
			
				if (grammar.hasOwnProperty(token)) {
					
					if (token == before) {
					
						for (var newToken in insert) {
						
							if (insert.hasOwnProperty(newToken)) {
								ret[newToken] = insert[newToken];
							}
						}
					}
					
					ret[token] = grammar[token];
				}
			}
			
			return root[inside] = ret;
		},
		
		// Traverse a language definition with Depth First Search
		DFS: function(o, callback) {
			for (var i in o) {
				callback.call(o, i, o[i]);
				
				if (_.util.type(o) === 'Object') {
					_.languages.DFS(o[i], callback);
				}
			}
		}
	},

	highlightAll: function(async, callback) {
		var elements = document.querySelectorAll('code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code');

		for (var i=0, element; element = elements[i++];) {
			_.highlightElement(element, async === true, callback);
		}
	},
		
	highlightElement: function(element, async, callback) {
		// Find language
		var language, grammar, parent = element;
		
		while (parent && !lang.test(parent.className)) {
			parent = parent.parentNode;
		}
		
		if (parent) {
			language = (parent.className.match(lang) || [,''])[1];
			grammar = _.languages[language];
		}

		if (!grammar) {
			return;
		}
		
		// Set language on the element, if not present
		element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
		
		// Set language on the parent, for styling
		parent = element.parentNode;
		
		if (/pre/i.test(parent.nodeName)) {
			parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language; 
		}

		var code = element.textContent;
		
		if(!code) {
			return;
		}
		
		code = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
		
		var env = {
			element: element,
			language: language,
			grammar: grammar,
			code: code
		};
		
		_.hooks.run('before-highlight', env);
		
		if (async && self.Worker) {
			var worker = new Worker(_.filename);	
			
			worker.onmessage = function(evt) {
				env.highlightedCode = Token.stringify(JSON.parse(evt.data), language);

				_.hooks.run('before-insert', env);

				env.element.innerHTML = env.highlightedCode;
				
				callback && callback.call(env.element);
				_.hooks.run('after-highlight', env);
			};
			
			worker.postMessage(JSON.stringify({
				language: env.language,
				code: env.code
			}));
		}
		else {
			env.highlightedCode = _.highlight(env.code, env.grammar, env.language)

			_.hooks.run('before-insert', env);

			env.element.innerHTML = env.highlightedCode;
			
			callback && callback.call(element);
			
			_.hooks.run('after-highlight', env);
		}
	},
	
	highlight: function (text, grammar, language) {
		return Token.stringify(_.tokenize(text, grammar), language);
	},
	
	tokenize: function(text, grammar, language) {
		var Token = _.Token;
		
		var strarr = [text];
		
		var rest = grammar.rest;
		
		if (rest) {
			for (var token in rest) {
				grammar[token] = rest[token];
			}
			
			delete grammar.rest;
		}
								
		tokenloop: for (var token in grammar) {
			if(!grammar.hasOwnProperty(token) || !grammar[token]) {
				continue;
			}
			
			var pattern = grammar[token], 
				inside = pattern.inside,
				lookbehind = !!pattern.lookbehind,
				lookbehindLength = 0;
			
			pattern = pattern.pattern || pattern;
			
			for (var i=0; i<strarr.length; i++) { // Don’t cache length as it changes during the loop
				
				var str = strarr[i];
				
				if (strarr.length > text.length) {
					// Something went terribly wrong, ABORT, ABORT!
					break tokenloop;
				}
				
				if (str instanceof Token) {
					continue;
				}
				
				pattern.lastIndex = 0;
				
				var match = pattern.exec(str);
				
				if (match) {
					if(lookbehind) {
						lookbehindLength = match[1].length;
					}

					var from = match.index - 1 + lookbehindLength,
					    match = match[0].slice(lookbehindLength),
					    len = match.length,
					    to = from + len,
						before = str.slice(0, from + 1),
						after = str.slice(to + 1); 

					var args = [i, 1];
					
					if (before) {
						args.push(before);
					}
					
					var wrapped = new Token(token, inside? _.tokenize(match, inside) : match);
					
					args.push(wrapped);
					
					if (after) {
						args.push(after);
					}
					
					Array.prototype.splice.apply(strarr, args);
				}
			}
		}

		return strarr;
	},
	
	hooks: {
		all: {},
		
		add: function (name, callback) {
			var hooks = _.hooks.all;
			
			hooks[name] = hooks[name] || [];
			
			hooks[name].push(callback);
		},
		
		run: function (name, env) {
			var callbacks = _.hooks.all[name];
			
			if (!callbacks || !callbacks.length) {
				return;
			}
			
			for (var i=0, callback; callback = callbacks[i++];) {
				callback(env);
			}
		}
	}
};

var Token = _.Token = function(type, content) {
	this.type = type;
	this.content = content;
};

Token.stringify = function(o, language, parent) {
	if (typeof o == 'string') {
		return o;
	}

	if (Object.prototype.toString.call(o) == '[object Array]') {
		return o.map(function(element) {
			return Token.stringify(element, language, o);
		}).join('');
	}
	
	var env = {
		type: o.type,
		content: Token.stringify(o.content, language, parent),
		tag: 'span',
		classes: ['token', o.type],
		attributes: {},
		language: language,
		parent: parent
	};
	
	if (env.type == 'comment') {
		env.attributes['spellcheck'] = 'true';
	}
	
	_.hooks.run('wrap', env);
	
	var attributes = '';
	
	for (var name in env.attributes) {
		attributes += name + '="' + (env.attributes[name] || '') + '"';
	}
	
	return '<' + env.tag + ' class="' + env.classes.join(' ') + '" ' + attributes + '>' + env.content + '</' + env.tag + '>';
	
};

if (!self.document) {
	// In worker
	self.addEventListener('message', function(evt) {
		var message = JSON.parse(evt.data),
		    lang = message.language,
		    code = message.code;
		
		self.postMessage(JSON.stringify(_.tokenize(code, _.languages[lang])));
		self.close();
	}, false);
	
	return;
}

// Get current script and highlight
var script = document.getElementsByTagName('script');

script = script[script.length - 1];

if (script) {
	_.filename = script.src;
	
	if (document.addEventListener && !script.hasAttribute('data-manual')) {
		document.addEventListener('DOMContentLoaded', _.highlightAll);
	}
}

})();

/* **********************************************
     Begin prism-markup.js
********************************************** */

Prism.languages.markup = {
	'comment': /&lt;!--[\w\W]*?-->/g,
	'prolog': /&lt;\?.+?\?>/,
	'doctype': /&lt;!DOCTYPE.+?>/,
	'cdata': /&lt;!\[CDATA\[[\w\W]*?]]>/i,
	'tag': {
		pattern: /&lt;\/?[\w:-]+\s*(?:\s+[\w:-]+(?:=(?:("|')(\\?[\w\W])*?\1|[^\s'">=]+))?\s*)*\/?>/gi,
		inside: {
			'tag': {
				pattern: /^&lt;\/?[\w:-]+/i,
				inside: {
					'punctuation': /^&lt;\/?/,
					'namespace': /^[\w-]+?:/
				}
			},
			'attr-value': {
				pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/gi,
				inside: {
					'punctuation': /=|>|"/g
				}
			},
			'punctuation': /\/?>/g,
			'attr-name': {
				pattern: /[\w:-]+/g,
				inside: {
					'namespace': /^[\w-]+?:/
				}
			}
			
		}
	},
	'entity': /&amp;#?[\da-z]{1,8};/gi
};

// Plugin to make entity title show the real entity, idea by Roman Komarov
Prism.hooks.add('wrap', function(env) {

	if (env.type === 'entity') {
		env.attributes['title'] = env.content.replace(/&amp;/, '&');
	}
});


/* **********************************************
     Begin prism-css.js
********************************************** */

Prism.languages.css = {
	'comment': /\/\*[\w\W]*?\*\//g,
	'atrule': {
		pattern: /@[\w-]+?.*?(;|(?=\s*{))/gi,
		inside: {
			'punctuation': /[;:]/g
		}
	},
	'url': /url\((["']?).*?\1\)/gi,
	'selector': /[^\{\}\s][^\{\};]*(?=\s*\{)/g,
	'property': /(\b|\B)[\w-]+(?=\s*:)/ig,
	'string': /("|')(\\?.)*?\1/g,
	'important': /\B!important\b/gi,
	'ignore': /&(lt|gt|amp);/gi,
	'punctuation': /[\{\};:]/g
};

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'style': {
			pattern: /(&lt;|<)style[\w\W]*?(>|&gt;)[\w\W]*?(&lt;|<)\/style(>|&gt;)/ig,
			inside: {
				'tag': {
					pattern: /(&lt;|<)style[\w\W]*?(>|&gt;)|(&lt;|<)\/style(>|&gt;)/ig,
					inside: Prism.languages.markup.tag.inside
				},
				rest: Prism.languages.css
			}
		}
	});
}

/* **********************************************
     Begin prism-clike.js
********************************************** */

Prism.languages.clike = {
	'comment': {
		pattern: /(^|[^\\])(\/\*[\w\W]*?\*\/|(^|[^:])\/\/.*?(\r?\n|$))/g,
		lookbehind: true
	},
	'string': /("|')(\\?.)*?\1/g,
	'class-name': {
		pattern: /((?:(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/ig,
		lookbehind: true,
		inside: {
			punctuation: /(\.|\\)/
		}
	},
	'keyword': /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/g,
	'boolean': /\b(true|false)\b/g,
	'function': {
		pattern: /[a-z0-9_]+\(/ig,
		inside: {
			punctuation: /\(/
		}
	},
	'number': /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?)\b/g,
	'operator': /[-+]{1,2}|!|&lt;=?|>=?|={1,3}|(&amp;){1,2}|\|?\||\?|\*|\/|\~|\^|\%/g,
	'ignore': /&(lt|gt|amp);/gi,
	'punctuation': /[{}[\];(),.:]/g
};


/* **********************************************
     Begin prism-javascript.js
********************************************** */

Prism.languages.javascript = Prism.languages.extend('clike', {
	'keyword': /\b(var|let|if|else|while|do|for|return|in|instanceof|function|get|set|new|with|typeof|try|throw|catch|finally|null|break|continue)\b/g,
	'number': /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?|NaN|-?Infinity)\b/g
});

Prism.languages.insertBefore('javascript', 'keyword', {
	'regex': {
		pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\r\n])+\/[gim]{0,3}(?=\s*($|[\r\n,.;})]))/g,
		lookbehind: true
	}
});

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'script': {
			pattern: /(&lt;|<)script[\w\W]*?(>|&gt;)[\w\W]*?(&lt;|<)\/script(>|&gt;)/ig,
			inside: {
				'tag': {
					pattern: /(&lt;|<)script[\w\W]*?(>|&gt;)|(&lt;|<)\/script(>|&gt;)/ig,
					inside: Prism.languages.markup.tag.inside
				},
				rest: Prism.languages.javascript
			}
		}
	});
}


/* **********************************************
     Begin prism-file-highlight.js
********************************************** */

(function(){

if (!self.Prism || !self.document || !document.querySelector) {
	return;
}

var Extensions = {
	'js': 'javascript',
	'html': 'markup',
	'svg': 'markup'
};

Array.prototype.slice.call(document.querySelectorAll('pre[data-src]')).forEach(function(pre) {
	var src = pre.getAttribute('data-src');
	var extension = (src.match(/\.(\w+)$/) || [,''])[1];
	var language = Extensions[extension] || extension;
	
	var code = document.createElement('code');
	code.className = 'language-' + language;
	
	pre.textContent = '';
	
	code.textContent = 'Loading…';
	
	pre.appendChild(code);
	
	var xhr = new XMLHttpRequest();
	
	xhr.open('GET', src, true);

	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			
			if (xhr.status < 400 && xhr.responseText) {
				code.textContent = xhr.responseText;
			
				Prism.highlightElement(code);
			}
			else if (xhr.status >= 400) {
				code.textContent = '✖ Error ' + xhr.status + ' while fetching file: ' + xhr.statusText;
			}
			else {
				code.textContent = '✖ Error: File does not exist or is empty';
			}
		}
	};
	
	xhr.send(null);
});

})();
bespoke.from('article', {
    keys: true,
    bullets: 'li, .bullet',
    scale: true,
    hash: true,
    progress: true,
    state: true,
    forms: true,
    fx: {
        direction: "horizontal",
        transition: "slide",
        reverse: false
    }
});