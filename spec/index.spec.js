var psRactiveRouter = require('../src/index');

describe('Index', function() {
	
	it('Should export BaseApp component', function() {
		expect(psRactiveRouter.BaseApp.extend).toBeDefined();
	});
	
	it('Should export BagePage component', function() {
		expect(psRactiveRouter.BasePage.extend).toBeDefined();
	});
	
	it('Should export Router component', function() {
		expect(psRactiveRouter.RouterManager.navTo).toBeDefined();
		expect(psRactiveRouter.RouterManager.init).toBeUndefined();
	});
	
});