var Ractive = require('ractive'),
	BasePage = require('../../src/components/base-page-component');

describe('Base page component', function() {

	beforeEach(function() {
		Ractive.components = {};
	});

	it('Should register page component globally', function() {
		expect(Object.keys(Ractive.components).length).toEqual(0);

		BasePage.extend({
			name: 'DummyPage'
		});

		expect(Object.keys(Ractive.components).length).toEqual(1);
	});

	it('Should have its property name', function() {
		var Page = BasePage.extend({
			name: 'ContactPage'
		});
		expect(Page._name).toEqual('ContactPage');
		expect(Ractive.components.ContactPage._name).toEqual('ContactPage');
	});

	it('Should register custom events', function(done) {
		var Page = BasePage.extend({
				name: 'ProfilePage',
				template: '<div><a href="#">Open user popup</a></div>',
				events: {
					openUserPopup: function() {
						done();
					}
				},
				data: function() {
					return {
						req: {
							pageName: 'ProfilePage'
						}
					}
				}
			}),
			instance = new Page();

		instance.fire('openUserPopup');
	});

	it('Should call provided callback when navigating to the current page', function() {
		var onRequestDoneSpy = jasmine.createSpy('onRequestDone'),
			Page = BasePage.extend({
				name: 'AboutPage',
				template: '<div><h2>About page</h2></div>',
				onRequestDone: onRequestDoneSpy
			}),
			ractive = new Ractive({
				template: '<div><AboutPage/></div>',
				components: {
					AboutPage: Page
				},
				data: { req: { pageName: 'AboutPage' } }
			}),
			reqData = {
				pageName: 'AboutPage',
				params: { foo: 'bar' },
				locals: { bar: 'foo'}
			};

		ractive.set('req', reqData);

		// When instantiating page component, Ractive will fire the observe callback
		// Then, this callback will be called again aget ractive.set
		expect(onRequestDoneSpy.calls.count()).toEqual(2);
		expect(onRequestDoneSpy.calls.argsFor(1)[0]).toEqual(reqData);
	});

	it('Should NOT call provided callback when navigating to the current page', function() {
		var onRequestDoneSpy = jasmine.createSpy('onRequestDone'),
			Page = BasePage.extend({
				name: 'HelpPage',
				template: '<div><h2>Help page</h2></div>',
				onRequestDone: onRequestDoneSpy
			}),
			ractive = new Ractive({
				template: '<div><HelpPage/></div>',
				components: {
					HelpPage: Page
				},
				data: function() {
					return { req: { pageName: 'DummyPage' } };
				}
			});

		ractive.set('req', { pageName: 'DummyPage' });

		expect(onRequestDoneSpy.calls.count()).toEqual(0);
	});

	it('Should allow onconfig callback to be overloaded', function() {
		var onConfigSpy = jasmine.createSpy('onconfig'),
			Page = BasePage.extend({
				name: 'OrdersPage',
				onconfig: onConfigSpy,
				data: function() {
					return { req: { pageName: 'OrdersPage' } };
				}
			}),
			instance = new Page();

		expect(instance.navTo).toBeDefined();
		expect(onConfigSpy).toHaveBeenCalled();
	});

	it('Should allow oncomplete callback to be overloaded', function() {
		var onCompleteSpy = jasmine.createSpy('oncomplete'),
			Page = BasePage.extend({
				name: 'ProductsPage',
				oncomplete: onCompleteSpy,
				data: function() {
					return { req: { pageName: 'ProductsPage' } };
				}
			}),
			instance = new Page();

		instance.oncomplete();
		expect(instance.navTo).toBeDefined();
		expect(onCompleteSpy).toHaveBeenCalled();
	});
});