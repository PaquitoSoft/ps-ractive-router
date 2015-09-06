var Ractive = require('ractive'),
	BaseApp = require('../src/base-app'),
	BasePage = require('../src/components/base-page-component'),
	routerManager = require('../src/router-manager');

describe('BaseApp', function() {

	var noop = function() {};

	beforeEach(function() {
		routerManager.reset();
	});

	it('Should return a Ractive instance', function() {
		var app = BaseApp.extend(),
			componentsNames = Object.keys(app.components);

		expect(app).not.toBe(undefined);
		expect(app.viewmodel).toBeDefined()
		expect(app.fragment).toBeDefined();

		expect(app.el).toEqual('#app');
		expect(componentsNames.length).toEqual(2);
		expect(componentsNames).toContain('Router');
		expect(componentsNames).toContain('EmptyPage');
		expect(app.get('componentName')).toEqual('EmptyPage');
		expect(app.showError).toBeDefined();

		spyOn(app, 'showError').and.callThrough();
		app.showError();
		expect(app.showError).toHaveBeenCalled();
	});

	it('Should merge provided options over default ones', function() {
		var options = {
				el: '#dummy',
				showError: noop
			},
			app = BaseApp.extend(options);

		expect(app.el).toEqual('#dummy');
		expect(app.showError).toEqual(options.showError);
	});

	it('Should merge provided components with inner ones', function() {
		var options = {
				components: {
					DummyComponent: Ractive.extend({ template: '' })
				}
			},
			app = BaseApp.extend(options),
			componentsNames = Object.keys(app.components);

		expect(componentsNames.length).toEqual(3);
		expect(componentsNames).toContain('DummyComponent');
		expect(componentsNames).toContain('Router');
		expect(componentsNames).toContain('EmptyPage');
	});

	it('Should respect provided template', function() {
		var app = BaseApp.extend({
			template: '<div>Rollo Tomassi</div>'
		});

		expect(app.template[0].e).toEqual('div');
		expect(app.template[0].f[0]).toEqual('Rollo Tomassi');
	});

	it('Should initialize router with provided routes', function() {
		var options = {
				routesConfiguration: {
					'/foo/bar': noop
				}
			},
			app;

		spyOn(routerManager, 'init');

		app = BaseApp.extend(options);
		app.oncomplete();

		expect(routerManager.init.calls.argsFor(0)[0]).toEqual(options.routesConfiguration);
	});

	it('Should not initialize router if no configuration is provided', function() {
		spyOn(routerManager, 'init');

		var app = BaseApp.extend();
		app.oncomplete();

		expect(routerManager.init).not.toHaveBeenCalled();
	});

	it('Should allow overload oncomplete callback', function() {
		var options = {
				routesConfiguration: {
					'/foo/bar': noop
				},
				oncomplete: function() {
					expect(true).toEqual(true);
				}
			},
			app;

		spyOn(routerManager, 'init');

		app = BaseApp.extend(options);
		app.oncomplete();

		expect(routerManager.init.calls.argsFor(0)[0]).toEqual(options.routesConfiguration);
	});

	it('Should use provided showError callback', function(done) {
		var options = {
				routesConfiguration: {
					'/foo': function(context, next) {
						next(new Error('Test error'));
					}
				},
				showError: function(message) {
					expect(message).toEqual('Test error');
					done();
				}
			},
			app = BaseApp.extend(options);

		app.oncomplete();
		routerManager.navTo('/foo');
	});

	it('Should update inner data when successfully navigating', function() {
		var options = {
				routesConfiguration: {
					'/foo/:name': function(context, next) {
						var HelloPage = BasePage.extend({
							name: 'HelloPage',
							template: '<p>Hello</p>'
						});
						next(null, HelloPage, { foo: 'baz' });
					}
				}
			},
			app = BaseApp.extend(options),
			req, componentName;

		app.oncomplete();
		routerManager.navTo('/foo/bar');

		req = app.get('req'),
		componentName = app.get('componentName');

		expect(componentName).toEqual('HelloPage');
		expect(req.params.name).toEqual('bar');
		expect(req.locals.foo).toEqual('baz');
	});
});