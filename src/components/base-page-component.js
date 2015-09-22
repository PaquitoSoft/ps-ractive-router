var Ractive = require('ractive'),
	objectAssign = require('object-assign'),
	routerManager = require('../router-manager');

var noop = function() {};

module.exports.extend = function createPageComponent(options) {
	var pageProperties = objectAssign({
			template: '',
			events: {},
			onRequestDone: noop
		}, options),
		_onConfig = noop,
		_onComplete = noop,
		PageComponent;

	if (pageProperties.onconfig) {
		_onConfig = pageProperties.onconfig;
	}

	if (pageProperties.oncomplete) {
		_onComplete = pageProperties.oncomplete;
	}

	// Observe 'req' property which will be updated when the route
	// controller wants to update this page view
	pageProperties.onconfig = function _onConfiguration() {
		var self = this;
		// console.log('BasePageComponent::onConfig# Configuring page component:', pageProperties.name);

		this.observe('req', function(request) {
			// console.log('BasePageComponent::onConfig# We have a new request...', request);
			// We just fire the callback when routing to this page
			if (pageProperties.name === request.pageName) {
				pageProperties.onRequestDone.call(this, request);
			}
		});

		Object.keys(pageProperties.events).forEach(function(key) {
			self.on(key, pageProperties.events[key]);
		});

		this.navTo = routerManager.navTo;

		_onConfig.call(this);
	}

	pageProperties.oncomplete = function() {
		this.fire('PageNavigationDone');
		_onComplete.call(this);
	}

	PageComponent = Ractive.extend(pageProperties);
	PageComponent._name = pageProperties.name;
	Ractive.components[pageProperties.name] = PageComponent;

	return PageComponent;
}
