/**
 * Created by 弘树<tiehang.lth@alibaba-inc.com> on 14-7-27.
 * @component h
 */
KISSY.add(function (S, VNode, VText, typeCheck, parseTag) {

	"use strict";

	var isArray = S.isArray;
	var isString = S.isString;

	function h(tagName, properties, children) {
		var tag, props, childNodes, key;

		if (!children) {
			if (isChildren(properties)) {
				children = properties;
				properties = undefined;
			}
		}

		tag = parseTag(tagName, properties);

		if (!isString(tag)) {
			props = tag.properties;
			tag = tag.tagName;
		} else {
			props = properties;
		}

		if (isArray(children)) {

			children.forEach(function(child, idx){
				if (isString(child)) {
					children[idx] = new VText(child);
				}
			});

			childNodes = children;
		} else if (isString(children)) {
			childNodes = [new VText(children)];
		} else if (isChild(children)) {
			childNodes = [children];
		}

		if (props && "key" in props) {
			key = props.key;
			delete props.key;
		}

		return new VNode(tag, props, childNodes, key);
	}

	function isChild(x) {
		return typeCheck.isVirtualNode(x) || typeCheck.isVirtualText(x) || typeCheck.isWidget(x);
	}

	function isChildren(x) {
		return isArray(x) || isString(x) || isChild(x);
	}


	return h;
}, {requires: [
	'./vnode',
	'./vtext',
	'./type-check',
	'./parse-tag'
]});