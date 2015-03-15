/**
 * Created by 弘树<tiehang.lth@alibaba-inc.com> on 14-7-27.
 * @component vnode
 */
KISSY.add(function (S, version, typeCheck) {

	"use strict";

	var noProperties = {};
	var noChildren = [];

	function VirtualNode(tagName, properties, children, key) {
		this.tagName = tagName;
		this.properties = properties || noProperties;
		this.children = children || noChildren;
		this.key = key != null ? String(key) : undefined;

		var descendants = 0;
		var hasWidgets = false;
		var descendantHooks = false;
		var hooks = {};

		S.each(properties, function(property, propName){
			if (typeCheck.isHook(property)) {
				hooks[propName] = property
			}
		});

		if(children){
			S.each(children, function(child){
				if (typeCheck.isVirtualNode(child)) {
					descendants += child.count || 0;

					if (!hasWidgets && child.hasWidgets) {
						hasWidgets = true
					}

					if (!descendantHooks && (child.hooks || child.descendantHooks)) {
						descendantHooks = true
					}
				} else if (!hasWidgets && typeCheck.isWidget(child)) {
					if (typeof child.destroy === "function") {
						hasWidgets = true
					}
				}
			});
		}

		this.count = (this.children.length || 0) + descendants;
		this.hasWidgets = hasWidgets;
		this.hooks = hooks;
		this.descendantHooks = descendantHooks;
	}

	VirtualNode.prototype.version = version;
	VirtualNode.prototype.type = "VirtualNode";

	return VirtualNode;
}, {requires: [
	'./version',
	'./type-check'
]});