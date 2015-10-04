var Ractive = require('ractive'),
	objectAssign = require('object-assign'),
	routerManager = require('./router-manager'),
	RouterComponent = require('./components/router-component');

var noop = function() {};

module.exports.extend = function createApp(options) {
	var defaults = {
			el: '#app',

			components: {},

			routesConfiguration: {},

			template: '<div>Missing application template</div>',

			onBeforeNavigation: noop,
			onNavigationDone: noop,

			pagejsConfig: {},

			showError: function _defaultErrorHandler(message) {
				console.warn('You should implement this function to show this routing error:', message);
			}
		},
		appProperties = objectAssign({}, defaults, options || {}),
		originalOnComplete = appProperties.oncomplete;

	appProperties.components = objectAssign({
		Router: RouterComponent,
		EmptyPage: Ractive.extend({ template: '' })
	}, appProperties.components);

	appProperties.data = objectAssign({}, appProperties.data, { componentName: 'EmptyPage' });

	appProperties.oncomplete = function _onComplete() {
		if (appProperties.routesConfiguration && Object.keys(appProperties.routesConfiguration).length) {
			routerManager.init(appProperties.routesConfiguration,
				this.onNavigation.bind(this),
				objectAssign({
					onBeforeNavigation: appProperties.onBeforeNavigation.bind(this)
				}, appProperties.pagejsConfig));
		} else {
			console.warn('Router has not been started as you did not provide its configuration.');
		}

		if (originalOnComplete) {
			originalOnComplete.call(this);
		}

		this.on('*.PageNavigationDone', function() {
			appProperties.onNavigationDone.call(this);
		}.bind(this));
	};

	appProperties.onNavigation = function _onNavigation(error, navigationContext) {
		if (error) {
			console.warn('App::onNavigation# Error navigating:', error);
			this.showError(error.displayMessage || error.message, error);
		} else {
			this.set({
				req: {
					params: navigationContext.params,
					locals: navigationContext.state,
					pageName: navigationContext.pageName
				},
				componentName: navigationContext.pageName
			});
		}
	};

	return new Ractive(appProperties);
}
