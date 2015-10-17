# PS-RACTIVE-ROUTER [![Build Status](https://travis-ci.org/PaquitoSoft/ps-ractive-router.svg?branch=master)](https://travis-ci.org/PaquitoSoft/ps-ractive-router) [![Test Coverage](https://codeclimate.com/github/PaquitoSoft/ps-ractive-router/badges/coverage.svg)](https://codeclimate.com/github/PaquitoSoft/ps-ractive-router/coverage) [![Code Climate](https://codeclimate.com/github/PaquitoSoft/ps-ractive-router/badges/gpa.svg)](https://codeclimate.com/github/PaquitoSoft/ps-ractive-router)

This is a small module implementing a router to be used in [RactiveJS](http://www.ractivejs.org/) applications.
The routing management is implemented using the awesome [PageJS](https://github.com/visionmedia/page.js) module.

If you ever wanted to build a client-side application with ractive and needed a router system to help with client navigation, this module may help you.

This module plays with three main components:
* BaseApp: Your application entry point must extend this component
* BasePage: Every main view of your application must extend this component
* RouterManage: This is a helper which provides a navigation function when you need to navigate explicitly

*ps-ractive-router* can be used from tour code *globally* or with *amd* or *commonjs* dependecy formats

There's [another repo](https://github.com/PaquitoSoft/podcaster) where you can find a simple application implemented with this module using different
dependency styles. Just check its branches out.

**IMPORTANT**: This module is intented to be used by users who already know [Ractive](http://www.ractivejs.org/).
If you haven't used that awesome library, you should check its [tutorials site](http://learn.ractivejs.org/hello-world/1/) first and
read its [documentation](http://docs.ractivejs.org/latest/get-started).

# Getting started

Install this module using NPM:
```
npm install ps-ractive-router --save
```
or Bower:
```
bower install ps-ractive-router --save
```

Your main application module must inherit *BaseApp* component. This is just a *Ractive* instance with some
routing management logic. You must call *BaseApp.extend* to inherit from this module. The function accepts
and configuration object you can populate with [every single Ractive instance property](http://docs.ractivejs.org/latest/options)
and some custom attributes you can check below.
```
(function(APP) {
	'use strict';

	var BaseApp = PSRR.BaseApp,
		templates = APP.plugins.templates,
		routesConfiguration = APP.config.routes;

	BaseApp.extend({
		el: '#app',
		template: templates.getTemplate('app-tpl'),
		routesConfiguration: routesConfiguration,
		onBeforeNavigation: function() {
			this.set('loading', true);
		},
		onNavigationDone: function() {
			window.scrollTo(0, 0);
			this.set('loading', false);
		},
		showError: function(message, err) {
			console.log('What an error!!!', err.stack);
			this.set('errorMsg', message);
			setTimeout(function() {
				this.set('errorMsg', null);
			}.bind(this), 2500);
		},
		data: {
			loading: false
		}
	});

}(window.PodcasterApp));
```

This is an example template for the app:
```
<div>
	<div class="header clearfix">
		<h3 class="text-muted">
			<a href="/">
				Podcaster
			</a>
			<div class="spinner {{^loading}}hidden{{/}}">
				<div class="double-bounce1"></div>
				<div class="double-bounce2"></div>
			</div>
		</h3>
	</div>

	<div class="main-content">
		<Router />
	</div>
</div>
```

Notice the **Router** element component. This is the placeholder where the module will insert your page
views in the template upon user navigation.

# API
Here's a detailed description of each component:

## BaseApp
This is the boilerplate component for your main application instance.
### extend(options)
This function creates a Ractive instance which will hold your main application instance.

**Arguments**:

- **options** {Object}: All Ractive instances [options](http://docs.ractivejs.org/latest/options) plus these ones:
	- **routesConfiguration** {Object} (**required**): This is an object where its keys are [pagejs like paths](https://github.com/visionmedia/page.js)
		and values are the functions that should be onvoked upon navigation. More details below.
	- **onBeforeNavigation** {Function}: Callback to be invoked when a navigation has been requested
	- **onNavigationDone** {Function}: Callback to be invoked when a navigation has completed
	- **showError** {Function}: Callback to be fired when a navigation handler throws an error. Arguments:
		- **message** {String}: Error message
		- **error** {Error}: The error object
	- **pagejsConfig** {Object}: Underlying router engine configuration. Check all available options [here](https://github.com/visionmedia/page.js#pageoptions).

## BasePage
Your page view components should extend this one to allow easy navigation between your views.
## extend(options)
This function creates a Ractive [Component](http://docs.ractivejs.org/latest/components) that will represent your page views.

**Arguments**:

- **options** {Object}: All Ractive component [options](http://docs.ractivejs.org/latest/components#init) plus these ones:
	- **onRequestDone** {Function}: This function will be invoked when your view page its about
		to be rendered upon navigation. Arguments:
			- **request**:
	- **events** {Object}: This is an object with the events your component should listen to. Keys are
		the names of the events and values are its handlers.
