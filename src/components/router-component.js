var Ractive = require('ractive');

/*
	This router has been built on top of the ideas from this Stack Overflow question:
	http://stackoverflow.com/questions/31075341/how-to-create-ractives-subcomponents-dynamically-and-change-them-programmatical
*/

var Router = Ractive.extend({
	template: '<router-handler/>',
	components: {
		'router-handler': function() {
			console.log('RouterComponent::components::route-handler# component to be rendered:', this.get('componentName'));
			return this.get('componentName');
		}
	},
	oninit: function _oninit() {
		this.observe('componentName', function(newValue, oldValue) {
			console.log('RouterComponent::oninit# componentName changed!', newValue, oldValue);
			if (this.fragment.rendered) {
				this.reset();
				console.log('RouterComponent::oninit# component reset!');
			}
		});
		console.log('RouterComponent::oninit# component ready to be rendered:', this.get('componentName'));
	},
	onrender: function() {
		console.log('Rendering router component...', this.get('componentName'));
	}
});

module.exports = Router;
