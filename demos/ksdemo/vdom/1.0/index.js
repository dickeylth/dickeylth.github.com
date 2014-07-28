/**
 * @fileoverview 
 * @author 弘树<tiehang.lth@alibaba-inc.com>
 * @module vdom
 **/
KISSY.add(function (S, diff, patch, h, createElement) {

	return {
		diff: diff,
		patch: patch,
		h: h,
		createElement: createElement
	};

}, {requires:['./lib/diff', './lib/patch', './lib/h', './lib/create-element']});



