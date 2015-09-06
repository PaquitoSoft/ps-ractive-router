var routerManager = require('../src/router-manager'),
	BasePage = require('../src/components/base-page-component'),
	pagejs = require('page');

describe('Router Manager', function() {

	var noop = function() {};

	describe('navTo', function() {

		beforeEach(function() {
			spyOn(pagejs, 'show');
		});

		it('Should call pagejs only with URL', function() {
			var url = '/foo/bar';

			routerManager.navTo(url);

			expect(pagejs.show).toHaveBeenCalledWith(url, undefined);
		});

		it('Should call pagejs with URL and state', function() {
			var url = '/dummy',
				state = { foo: 'bar' };

			routerManager.navTo(url, state);

			expect(pagejs.show).toHaveBeenCalledWith(url, state);
		});

	});

	describe('init', function() {
		var DummyPage;

		beforeEach(function() {
			spyOn(pagejs, 'start');

			DummyPage = BasePage.extend({
				name: 'DummyPage',
				template: ''
			});
		});

		beforeEach(function() {
			pagejs.callbacks = [];
		});

		it('Should register provided routes', function() {
			var routes = {
					'/': noop,
					'/foo': noop
				},
				onNavigation = noop;

			expect(pagejs.callbacks.length).toEqual(0);

			routerManager.init(routes, onNavigation);

			expect(pagejs.start).toHaveBeenCalled();
			expect(pagejs.callbacks.length).toEqual(2);

		});

		it('Should call routes callbacks', function(done) {
			var routes = {
					'/foo': function(context, next) {
						expect(next).toBeDefined();
						expect(context.path).toEqual('/foo');
					},
					'/foo/bar': function(context, next) {
						expect(context.pathname).toEqual('/foo/bar');
						expect(context.querystring).toEqual('query=share');
						expect(context.state.name).toEqual('Rollo Tomassi');
						done();
					}
				},
				onNavigation = noop;

			expect(pagejs.callbacks.length).toEqual(0);

			routerManager.init(routes, onNavigation);

			expect(pagejs.start).toHaveBeenCalled();
			expect(pagejs.callbacks.length).toEqual(2);

			routerManager.navTo('/foo');
			routerManager.navTo('/foo/bar?query=share', { name: 'Rollo Tomassi' });

		});

		it('Should call onNavigation callback', function(done) {
			var routes = {
					'/foo/bar': function(context, next) {
						expect(context.pathname).toEqual('/foo/bar');
						expect(context.querystring).toEqual('query=share');
						expect(context.state.name).toEqual('Rollo Tomassi');
						next(null, DummyPage, {
							character: context.state.name,
							querystring: context.querystring
						});
					}
				},
				onNavigation = function(err, context) {
					expect(context.pageName).toEqual('DummyPage');
					expect(context.state.character).toEqual('Rollo Tomassi');
					expect(context.state.querystring).toEqual('query=share');
					done();
				};

			expect(pagejs.callbacks.length).toEqual(0);

			routerManager.init(routes, onNavigation);

			routerManager.navTo('/foo/bar?query=share', { name: 'Rollo Tomassi' });
		});

	});

	describe('reset', function() {

		beforeEach(function() {
			pagejs.callbacks = [];
		});

		it('Should reset configured callbacks', function() {
			var routes = {
				'/': noop,
				'/foo': noop
			};

			routerManager.init(routes, noop);

			expect(pagejs.callbacks.length).toEqual(2);

			routerManager.reset();

			expect(pagejs.callbacks.length).toEqual(0);
		});

	});

});
