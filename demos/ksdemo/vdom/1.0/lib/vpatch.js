/**
 * Created by 弘树<tiehang.lth@alibaba-inc.com> on 14-7-27.
 * @component vpatch
 */
KISSY.add(function (S, version, Node, Event, Base) {

	"use strict";

	var MAPS = ['NONE', 'VTEXT', 'VNODE', 'WIDGET', 'PROPS', 'ORDER', 'INSERT', 'REMOVE', 'THUNK'];
	MAPS.forEach(function(type, idx){
		VirtualPatch[type] = idx;
	});

	function VirtualPatch(type, vNode, patch) {
		this.type = Number(type);
		this.vNode = vNode;
		this.patch = patch;
	}

	VirtualPatch.prototype.version = version
	VirtualPatch.prototype.type = "VirtualPatch"

	return VirtualPatch;
}, {requires: [
	'./version'
]});