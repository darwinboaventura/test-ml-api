module.exports = function(app) {
	var Items = app.controllers.items;

	app.route('/api/items')
		.get(Items.getItems);

	app.route('/api/items/:id')
		.get(Items.getItemById);
};