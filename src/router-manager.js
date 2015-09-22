var pagejs = require('page'),
	objectAssign = require('object-assign');

function navigationHandler(routeHandler, onNavigation, onBeforeNavigation) {
	return function(context/*, next*/) {
		onBeforeNavigation.call(null, context);
		routeHandler(context, function(error, PageComponent, data) {
			var _err;

			if (error || !PageComponent) {
				_err = error || new Error('No PageComponent provided to render for current URL: ' + context.path);
				onNavigation(_err);
			} else {
				context.pageName = PageComponent._name;
				context.state = objectAssign(context.state, data),
				onNavigation(null, context);
			}

		});
	};
}

module.exports.init = function _init(routes, onNavigation, options) {
	var _options = objectAssign({
		onBeforeNavigation: function() {}
	}, options);

	Object.keys(routes).forEach(function _routesIterator(routePath) {
		pagejs(routePath, navigationHandler(routes[routePath], onNavigation, _options.onBeforeNavigation));
	});

	// Allow configure pagejs options from the ones received
	pagejs(objectAssign({
		hashbang: true
	}, _options));
}

module.exports.navTo = function _navTo(url, state) {
	pagejs.show(url, state);
}

module.exports.reset = function _reset() {
	pagejs.callbacks = [];
}
