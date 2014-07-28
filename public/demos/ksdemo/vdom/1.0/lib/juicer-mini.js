/**
 * Created by 弘树<tiehang.lth@alibaba-inc.com> on 14-7-26.
 * juicer-mini 从 Juicer v0.6.5-stable 修改而来，进行精简
 * thanks to Guokai 's http://juicer.name
 */
KISSY.add(function(S) {

	var HAS_OWN_PROPERTY = 'hasOwnProperty';

	// This is the main function for not only compiling but also rendering.
	// there's at least two parameters need to be provided, one is the tpl,
	// another is the data, the tpl can either be a string, or an id like #id.
	// if only tpl was given, it'll return the compiled reusable function.
	// if tpl and data were given at the same time, it'll return the rendered
	// result immediately.

	var juicer = function() {
		var args = [].slice.call(arguments),
			argsLength = arguments.length;

		args.push(juicer.options);

		if(argsLength == 1) {
			return juicer.compile.apply(juicer, args);
		} else if(argsLength >= 2) {
			return juicer.to_html.apply(juicer, args);
		}
	};

	var __escapehtml = {
		escapehash: {
			'<': '&lt;',
			'>': '&gt;',
			'&': '&amp;',
			'"': '&quot;',
			"'": '&#x27;',
			'/': '&#x2f;'
		},
		escapereplace: function(k) {
			return __escapehtml.escapehash[k];
		},
		escaping: function(str) {
			return S.isString(str) ? str.replace(/[&<>"]/igm, this.escapereplace) : str;
		},
		detection: function(data) {
			return S.isUndefined(data) ? '' : data;
		}
	};

	var __throw = function(error) {
		if(!S.isUndefined(console)) {
			console.warn(error);
		} else {
			throw(error);
		}

	};

	var __creator = function(o, proto) {

		o = o !== Object(o) ? {} : o;

		if(o.__proto__) {
			o.__proto__ = proto;
			return o;
		}

		return S.merge(Object.create(proto), o);
	};

	juicer.__cache = {};
	juicer.version = 'mini 0.0.1';
	juicer.settings = {};

	juicer.options = {
		_method: __creator({
			__escapehtml: __escapehtml,
			__throw: __throw,
			__juicer: juicer
		}, {})
	};

	juicer.tagInit = function() {
		var operationOpen = '{@',
			operationClose = '}',
			interpolateOpen = '\\${',
			interpolateClose = '}',
			noneencodeOpen = '\\$\\${',
			noneencodeClose = '}';
		var controlRegStr = {
			forstart: operationOpen + 'each\\s*([^}]*?)\\s*as\\s*(\\w*?)\\s*(,\\s*\\w*?)?' + operationClose,
			forend: operationOpen + '\\/each' + operationClose,
			ifstart: operationOpen + 'if\\s*([^}]*?)' + operationClose,
			ifend: operationOpen + '\\/if' + operationClose,
			elsestart: operationOpen + 'else' + operationClose,
			elseifstart: operationOpen + 'else if\\s*([^}]*?)' + operationClose,
			rangestart: operationOpen + 'each\\s*(\\w*?)\\s*in\\s*range\\(([^}]+?)\\s*,\\s*([^}]+?)\\)' + operationClose,
			include: operationOpen + 'include\\s*([^}]*?)\\s*,\\s*([^}]*?)' + operationClose,
			interpolate: interpolateOpen + '([\\s\\S]+?)' + interpolateClose,
			noneencode: noneencodeOpen + '([\\s\\S]+?)' + noneencodeClose
		};

		Object.keys(controlRegStr).forEach(function (key) {
			juicer.settings[key] = new RegExp(controlRegStr[key], 'igm');
		});
	};

	juicer.tagInit();


	// Before you're using custom functions in your template like ${name | fnName},
	// you need to register this fn by juicer.register('fnName', fn).

	juicer.register = function(fname, fn) {
		var _method = this.options._method;

		if(!_method[HAS_OWN_PROPERTY](fname)) {
			_method[fname] = fn
		}
	};

	juicer.template = function(options) {
		var that = this;

		this.options = options;

		this.__interpolate = function(_name, _escape, options) {
			var _define = _name.split('|'), _fn = _define[0] || '', _cluster;

			if(_define.length > 1) {
				_name = _define.shift();
				_cluster = _define.shift().split(',');
				_fn = '_method.' + _cluster.shift() + '.call({}, ' + [_name].concat(_cluster) + ')';
			}

			return '<%= ' + (_escape ? '_method.__escapehtml.escaping' : '')
				+ '(_method.__escapehtml.detection(' + _fn + ')) %>';
		};

		this.__removeShell = function(tpl, options) {
			var _counter = 0,
				settings = juicer.settings,
				replacements = {

					// for expression
					forstart: function($, _name, alias, key) {
						alias = alias || 'value', key = key && key.substr(1);
						var _iterate = 'i' + _counter++;
						return '<% ~function() {' +
							'for(var ' + _iterate + ' in ' + _name + ') {' +
							'if(' + _name + '.' + HAS_OWN_PROPERTY +'(' + _iterate + ')) {' +
							'var ' + alias + '=' + _name + '[' + _iterate + '];' +
							(key ? ('var ' + key + '=' + _iterate + ';') : '') +
							' %>';
					},
					forend: '<% }}}(); %>',

					// if expression
					ifstart: function($, condition) {
						return '<% if(' + condition + ') { %>';
					},
					ifend: '<% } %>',

					// else expression
					elsestart: '<% } else { %>',

					// else if expression
					elseifstart: function($, condition) {
						return '<% } else if(' + condition + ') { %>';
					},

					// interpolate without escape
					noneencode: function($, _name) {
						return that.__interpolate(_name, false, options);
					},

					// interpolate with escape
					interpolate: function($, _name) {
						return that.__interpolate(_name, true, options);
					},

					// range expression
					rangestart: function($, _name, start, end) {
						var _iterate = 'j' + _counter++;
						return '<% ~function() {' +
							'for(var ' + _iterate + '=' + start + ';' + _iterate + '<' + end + ';' + _iterate + '++) {{' +
							'var ' + _name + '=' + _iterate + ';' +
							' %>';
					},

					// include sub-template
					include: function($, tpl, data) {
						return '<%= _method.__juicer(' + tpl + ', ' + data + '); %>';
					}
				},
				replacementKeys = Object.keys(replacements);

			replacementKeys.forEach(function(key){
				tpl = tpl.replace(settings[key], replacements[key]);
			});

			// exception handling
			tpl = '<% try { %>' + tpl;
			tpl += '<% } catch(e) {_method.__throw("Juicer Render Exception: "+e.message);} %>';

			return tpl;
		};

		this.__toNative = function(tpl) {
			var buffer = [].join('');

			buffer += "'use strict';"; // use strict mode
			buffer += "var _=_||{};";
			buffer += "var _out='';_out+='";

			buffer += tpl
				.replace(/\\/g, "\\\\")
				.replace(/[\r\t\n]/g, " ")
				.replace(/'(?=[^%]*%>)/g, "\t")
				.split("'").join("\\'")
				.split("\t").join("'")
				.replace(/<%=(.+?)%>/g, "';_out+=$1;_out+='")
				.split("<%").join("';")
				.split("%>").join("_out+='") +
				"';return _out;";

			return buffer;
		};

		this.__lexicalAnalyze = function(tpl, options) {
			var buffer = [];
			var method = [];
			var prefix = '';
			var reserved = ['if', 'each'].concat(options.reserved || []);

			var variableAnalyze = function($, statement) {
				statement = statement.match(/\w+/igm)[0];

				var compareArr = buffer.concat(reserved, method);
				if(!S.inArray(statement, compareArr)) {

					// avoid re-declare native function, if not do this, template
					// `{@if encodeURIComponent(name)}` could be throw undefined.

					if(S.isFunction(window[statement]) && /^\s*?function \w+\(\) \{\s*?\[native code\]\s*?\}\s*?$/i.test(window[statement].toString())) {
						return $;
					}

					// avoid re-declare registered function, if not do this, template
					// `{@if registered_func(name)}` could be throw undefined.
					var juicerOptionsMethod = juicer.options._method;
					if(S.isFunction(juicerOptionsMethod[statement]) || juicerOptionsMethod[HAS_OWN_PROPERTY](statement)) {
						method.push(statement);
						return $;
					}

					buffer.push(statement); // fuck ie
				}

				return $;
			};

			var settings = juicer.settings;
			tpl.replace(settings.forstart, variableAnalyze).
				replace(settings.interpolate, variableAnalyze).
				replace(settings.ifstart, variableAnalyze).
				replace(settings.elseifstart, variableAnalyze).
				replace(settings.include, variableAnalyze).
				replace(/[\+\-\*\/%!\?\|\^&~<>=,\(\)\[\]]\s*([A-Za-z_]+)/igm, variableAnalyze);

			buffer.forEach(function(item){
				prefix += 'var ' + item + '=_.' + item + ';';
			});
			method.forEach(function(item){
				prefix += 'var ' + item + '=_method.' + item + ';';
			});

			return '<% ' + prefix + ' %>';
		};

		this.parse = function(tpl, options) {
			var _that = this;

			tpl = this.__lexicalAnalyze(tpl, options) + tpl;
			tpl = this.__removeShell(tpl, options);
			tpl = this.__toNative(tpl, options);

			this._render = new Function('_, _method', tpl);

			this.render = function(_, _method) {
				if(!_method || _method !== that.options._method) {
					_method = __creator(_method, that.options._method);
				}

				return _that._render.call(this, _, _method);
			};

			return this;
		};
	};

	juicer.compile = function(tpl, options) {
		if(!options || options !== this.options) {
			options = __creator(options, this.options);
		}

		try {
			var engine = this.__cache[tpl] ?
				this.__cache[tpl] :
				new this.template(this.options).parse(tpl, options);

			this.__cache[tpl] = engine;

			return engine;

		} catch(e) {
			__throw('Juicer Compile Exception: ' + e.message);

			return {
				render: function() {} // noop
			};
		}
	};

	juicer.to_html = function(tpl, data, options) {
		if(!options || options !== this.options) {
			options = __creator(options, this.options);
		}

		return this.compile(tpl, options).render(data, options._method);
	};

	return juicer;
});