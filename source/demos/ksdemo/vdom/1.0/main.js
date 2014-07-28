/**
 * Created by 弘树<tiehang.lth@alibaba-inc.com> on 14-7-28.
 * @component Main
 */
KISSY.add(function (S, Base, Node, JuicerMini, Mini) {

	"use strict";

	var EMPTY = '';
	var $ = Node.all;
	var stringify = JSON.stringify;

	/**
	 *
	 * @class Main
	 * @constructor
	 * @extends Base
	 */
	function Main(comConfig) {
		var self = this;
		//调用父类构造函数
		Main.superclass.constructor.call(self, comConfig);

		self.init(comConfig);
	}

	S.extend(Main, Base, /** @lends Main.prototype*/{

		init: function (cfg) {

			var self = this,
				container = self.get('container'),
				template = self.get('template'),
				data = self.get('data'),
				genHTML = template.render(data);
			self.render(container.getDOMNode(), genHTML);
			self.bindEvent();

		},

		bindEvent: function () {

			var self = this;

			self.on('afterDataChange', function (ev) {

				var newData = ev.newVal;

				S.log('change ' + ev.attrName + ': ' + stringify(ev.prevVal) + ' --> ' + stringify(newData));

				var template = self.get('template'),
					container = self.get('container'),
					genHTML = template.render(newData);

				console.log(genHTML);

				self.render(container, genHTML);

			});

		},

		render: function (containerNode, newHTML) {

			var preTree = self.tree;
			if(!preTree) {
				preTree = Mini.virtualize.fromHTML(newHTML);
				var rootNode = Mini.createElement(preTree);
				self.tree = preTree;
				self.rootNode = rootNode;
				containerNode.appendChild(rootNode);
			} else {
				var newTree = Mini.virtualize.fromHTML(newHTML);
				var patches = Mini.diff(preTree, newTree);
				self.rootNode = Mini.patch(self.rootNode, patches);
				self.tree = newTree;
			}

		}


	}, {ATTRS: /** @lends Main*/{

		/**
		 * 容器节点
		 */
		container: {
			value: null,
			getter: function (v) {
				return S.all(v);
			}
		},

		/**
		 * 关联的模板
		 */
		template: {
			value: '',
			setter: function (val) {
				return JuicerMini.compile(val);
			}
		},

		/**
		 * 关联的数据
		 */
		data: {
			value: null
		}

	}});
	return Main;
}, {requires: [
	'base',
	'node',
	'./lib/juicer-mini',
	'./mini'
]});