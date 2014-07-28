/**
 * Created by 弘树<tiehang.lth@alibaba-inc.com> on 14-7-27.
 * @component vtext
 */
KISSY.add(function (S, version) {

	"use strict";

	function VirtualText(text) {
		this.text = String(text)
	}

	VirtualText.prototype.version = version;
	VirtualText.prototype.type = "VirtualText";

	return VirtualText;
}, {requires: [
	'./version'
]});