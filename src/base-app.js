var Ractive = require('ractive'),
	objectAssign = require('object-assign'),
	routerManager = require('./router-manager'),
	RouterComponent = require('./components/router-component');

module.exports.extend = function createApp(options) {
	var defaults = {
			el: '#app',

			components: {},

			routesConfiguration: {},

			template: '<div>Missing application template</div>',

			showError: function _defaultErrorHandler(message) {
				console.warn('You should implement this function to show this routing error:', message);
			}
		},
		appProperties = objectAssign({}, defaults, options || {});

	return new Ractive({
		el: appProperties.el,
		template: appProperties.template,
		components: objectAssign({
			Router: RouterComponent,
			EmptyPage: Ractive.extend({ template: '' })
		}, appProperties.components),
		data: {
			componentName: 'EmptyPage'
		},
		oninit: function _onInit() {
			if (appProperties.routesConfiguration && appProperties.routesConfiguration.length) {
				routerManager.init(appProperties.routesConfiguration, this.onNavigation.bind(this));
			} else {
				console.warn('Router has not been started as you did not provide its configuration.');
			}
			
			console.log('App::oninit# Application initialized!');
		},
		onNavigation: function _onNavigation(error, navigationContext) {
			console.log('APP::onNavigation# Navigating to:', navigationContext.pageName, 'with context:', navigationContext);

			if (error) {
				console.warn('App::onNavigation# Error navigating:', error);
				this.showError(error.displayMessage || error.message);
			} else {
				this.set({
					req: {
						params: navigationContext.params,
						locals: navigationContext.state
					},
					componentName: navigationContext.pageName
				});
			}
		},
		showError: appProperties.showError
	});
}
