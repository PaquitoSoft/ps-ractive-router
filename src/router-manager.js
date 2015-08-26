var pagejs = require('page');

function navigationHandler(routeHandler, onNavigation) {
	return function(context/*, next*/) {
		routeHandler(context, function(error, PageComponent, data) {
			var _err;
			
			if (error || !PageComponent) {
				_err = error || new Error('No PageComponent provided to render for current URL: ' + context.path);
				onNavigation(_err);
			} else {
				context.pageName = PageComponent._name;
				context.state = data || {};
				onNavigation(null, context);	
			}
			
		});
	};
}

module.exports.init = function _init(routes, onNavigation, options) {
	// var _options = options || {}; // TODO Extend defaults with received

	Object.keys(routes).forEach(function _routesIterator(routePath) {
		pagejs(routePath, navigationHandler(routes[routePath], onNavigation));
	});

	// TODO Allow configure pagejs options from the ones received
	pagejs({
		hashbang: true
	});
}

module.exports.navTo = function _navTo(url, state) {
	pagejs.show(url, state);
}
