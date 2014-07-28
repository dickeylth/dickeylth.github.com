/**
 * Created by 弘树<tiehang.lth@alibaba-inc.com> on 14-7-27.
 * @component create-element
 */
KISSY.add(function (S, typeCheck, handleThunk, applyProperties) {

	"use strict";

	function createElement(vnode, opts) {
		var doc = opts ? opts.document || document : document;
		var warn = opts ? opts.warn : null;

		vnode = handleThunk(vnode).a;

		if (typeCheck.isWidget(vnode)) {
			return vnode.init();
		} else if (typeCheck.isVirtualText(vnode)) {
			return doc.createTextNode(vnode.text);
		} else if (!typeCheck.isVirtualNode(vnode)) {
			if (warn) {
				warn("Item is not a valid virtual dom node", vnode);
			}
			return null
		}

		var node = doc.createElement(vnode.tagName);

		var props = vnode.properties;
		applyProperties(node, props);

		var children = vnode.children;

		for (var i = 0; i < children.length; i++) {
			var childNode = createElement(children[i], opts);
			if (childNode) {
				node.appendChild(childNode);
			}
		}

		return node;
	}

	return createElement;
}, {requires: [
	'./type-check',
	'./handle-thunk',
	'./apply-properties'
]});