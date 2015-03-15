/**
 * Created by 弘树<tiehang.lth@alibaba-inc.com> on 14-7-27.
 * @component update-widget
 */
KISSY.add(function (S, typeCheck) {

	function updateWidget(a, b) {
		if (typeCheck.isWidget(a) && typeCheck.isWidget(b)) {
			if ("name" in a && "name" in b) {
				return a.id === b.id
			} else {
				return a.init === b.init
			}
		}

		return false;
	}

	return updateWidget;

}, {requires: [
	'./type-check'
]});