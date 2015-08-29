var Ractive = require('ractive'),
	objectAssign = require('object-assign'),
	routerManager = require('../router-manager');

module.exports.extend = function createPageComponent(options) {
	var pageProperties = objectAssign({
			template: '',
			events: {},
			onRequestDone: function() {}
		}, options || {}),
		_onConfig = function() {},
		pageComponent;

	if (pageProperties.onConfig) {
		_onConfig = pageProperties.onConfig;
	}

	// Observe 'req' property which will be updated when the route
	// controller wants to update this page view
	pageProperties.onconfig = function _onConfiguration() {
		var self = this;
		console.log('BasePageComponent::onConfig# Configuring page component:', pageProperties.name);
		
		this.observe('req', function(request) {
			console.log('BasePageComponent::onConfig# We have a new request...');
			pageProperties.onRequestDone.call(this, request);
		});

		Object.keys(pageProperties.events).forEach(function(key) {
			self.on(key, pageProperties.events[key]);
		});

		this.navTo = routerManager.navTo;

		_onConfig.call(this);
	}

	pageComponent = Ractive.extend(pageProperties);
	pageComponent._name = pageProperties.name;
	Ractive.components[pageProperties.name] = pageComponent;

	return pageComponent;
}
