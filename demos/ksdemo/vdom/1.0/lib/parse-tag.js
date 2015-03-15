/**
 * Created by 弘树<tiehang.lth@alibaba-inc.com> on 14-7-27.
 * @component parse-tag
 */
KISSY.add(function (S, split) {

	"use strict";

	var classIdSplit = /([\.#]?[a-zA-Z0-9_:-]+)/;
	var notClassId = /^\.|#/;

	function parseTag(tag, props) {
		if (!tag) {
			return "div";
		}

		var noId = !props || !("id" in props);

		var tagParts = split(tag, classIdSplit);
		var tagName = null;

		if(notClassId.test(tagParts[1])) {
			tagName = "div";
		}

		var id, classes, part, type;
		tagParts.forEach(function(part){
			if(part){
				type = part.charAt(0);

				if (!tagName) {
					tagName = part
				} else if (type === ".") {
					classes = classes || [];
					classes.push(part.substring(1, part.length));
				} else if (type === "#" && noId) {
					id = part.substring(1, part.length);
				}
			}
		});

		var parsedTags;

		if (props) {
			if (id !== undefined && !("id" in props)) {
				props.id = id;
			}

			if (classes) {
				if (props.className) {
					classes.push(props.className);
				}

				props.className = classes.join(" ");
			}

			parsedTags = tagName;

		} else if (classes || id !== undefined) {
			var properties = {};

			if (id !== undefined) {
				properties.id = id;
			}

			if (classes) {
				properties.className = classes.join(" ");
			}

			parsedTags = {
				tagName: tagName,
				properties: properties
			}
		} else {
			parsedTags = tagName;
		}

		return parsedTags;
	}

	return parseTag;

}, {requires: [
	'./browser-split'
]});