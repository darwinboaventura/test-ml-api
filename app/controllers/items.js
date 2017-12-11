const axios = require('axios');

module.exports = function(app) {
	return {
		getItems: function(req, res) {
			const queryParam = req.query.q;

			axios.get(process.env.API_URL + '/sites/MLA/search?q=' + queryParam)
			.then((response) => {
				const data = {
					author: {
						name: '',
						lastname: ''
					}
				};

				data.items = response.data.results;
				data.categories = [];

				response.data.filters.forEach(function(filter) {
					filter.values.forEach(function(value) {
						value.path_from_root.forEach(function(path) {
							data.categories.push(path.name);
						});
					});
				});

				res.json(data);
			})
			.catch((err) => {
				console.log(err);
			});			
		},
		getItemById: function(req, res) {
			const idParam = req.params.id;
			const data = {
				author: {
					name: '',
					lastname: ''
				},
				item: {
					price: {}
				}
			};		

			axios.get(process.env.API_URL + '/items/' + idParam)
			.then((response) => {
				const price = String(response.data.price).split('.');
				
				data.item.id = response.data.id;
				data.item.title = response.data.title;
				data.item.price.currency = response.data.currency_id;
				data.item.price.amount = parseInt(price[0]);
				data.item.price.decimals = price.length > 1 ? parseInt(price[1]) : 00;
				data.item.picture = response.data.pictures[0].url;
				data.item.condition = response.data.condition;
				data.item.free_shipping = response.data.shipping.free_shipping;
				data.item.sold_quantity = parseInt(response.data.sold_quantity);

				axios.get(process.env.API_URL + '/items/' + idParam + '/description')
				.then((responseDescription) => {
					data.item.description = responseDescription.data.plain_text;

					res.json(data);
				})
				.catch((err) => {
					console.log(err);
				});	
			})
			.catch((err) => {
				console.log(err);
			});	
		}
	};
};