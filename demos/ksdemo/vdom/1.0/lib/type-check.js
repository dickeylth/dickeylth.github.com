/**
 * Created by 弘树<tiehang.lth@alibaba-inc.com> on 14-7-27.
 * @component type-check
 */
KISSY.add(function (S, version) {

	"use strict";

	return {
		isThunk: function (t) {
			return t && t.type === "Thunk"
		},
		isHook: function (hook) {
			return hook && typeof hook.hook === "function" &&
				!hook.hasOwnProperty("hook")
		},
		isVirtualNode: function (x) {
			return x && x.type === "VirtualNode" && x.version === version
		},
		isVirtualText: function (x) {
			return x && x.type === "VirtualText" && x.version === version;
		},
		isWidget: function (w) {
			return w && w.type === "Widget";
		}
	};
}, {requires: [
	'./version'
]});