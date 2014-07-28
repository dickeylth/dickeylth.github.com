/**
 * @fileoverview 
 * @author 弘树<tiehang.lth@alibaba-inc.com>
 * @module vdom from [virtual-dom](https://github.com/Matt-Esch/virtual-dom)
 **/
KISSY.add(function (S, diff, patch, h, createElement, domVirtualize) {

	return {
		diff: diff,
		patch: patch,
		h: h,
		createElement: createElement,
		virtualize: domVirtualize
	};

}, {requires:['./lib/diff', './lib/patch', './lib/h', './lib/create-element', './lib/dom-virtualize']});



