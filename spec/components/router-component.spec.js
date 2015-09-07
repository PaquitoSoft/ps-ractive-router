var Ractive = require('ractive'),
	RouterComponent = require('../../src/components/router-component');

describe('Router component', function() {

	beforeEach(function() {
		spyOn(RouterComponent.components, 'router-handler').and.callThrough();
	});

	it('Should have a router-handler dynamic component', function() {
		new Ractive({
			template: '<div><RouterComponent/></div>',
			components: {
				RouterComponent: RouterComponent,
				EmptyPage: Ractive.extend({ template: '<div>Empty page</div>' })
			},
			data: { componentName: 'EmptyPage' }
		});

		expect(RouterComponent.components['router-handler']).toHaveBeenCalled();
	});

	it('Should observe componentName attribute so it re-renders when updated', function() {
		var app = new Ractive({
				template: '<div><RouterComponent/></div>',
				components: {
					RouterComponent: RouterComponent,
					EmptyPage: Ractive.extend({ template: '<div>Empty page</div>' }),
					HomePage: Ractive.extend({ template: '<div>Home page</div>'})
				},
				data: { componentName: 'EmptyPage' }
			}),
			routerComponent = app.findComponent('RouterComponent');

		spyOn(routerComponent, 'reset');
		routerComponent.fragment.rendered = true;

		expect(routerComponent.reset).not.toHaveBeenCalled();

		app.set('componentName', 'HomePage');

		expect(routerComponent.reset).toHaveBeenCalled();
	});

});
