/**
 * Created by 弘树<tiehang.lth@alibaba-inc.com> on 14-7-27.
 * @component handle-thunk
 */
KISSY.add(function (S, typeCheck) {

	"use strict";

	function handleThunk(a, b) {
		var renderedA = a
		var renderedB = b

		if (typeCheck.isThunk(b)) {
			renderedB = renderThunk(b, a)
		}

		if (typeCheck.isThunk(a)) {
			renderedA = renderThunk(a, null)
		}

		return {
			a: renderedA,
			b: renderedB
		}
	}

	function renderThunk(thunk, previous) {
		var renderedThunk = thunk.vnode;

		if (!renderedThunk) {
			renderedThunk = thunk.vnode = thunk.render(previous)
		}

		if (!(typeCheck.isVirtualNode(renderedThunk) ||
			typeCheck.isVirtualText(renderedThunk) ||
			typeCheck.isWidget(renderedThunk))) {
			throw new Error("thunk did not return a valid node");
		}

		return renderedThunk
	}

	return handleThunk;

}, {requires: [
	'./type-check'
]});