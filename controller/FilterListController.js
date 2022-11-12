const CarModel = require('../model/CarModel');
class FilterListController {
	async get_distance_driven(req, res) {
		try {
			const list = await CarModel.find()
				.select('distance_driven')
				.sort({ distance_driven: 1 });
			let list_distance_driven = [];
			list.forEach(item => {
				list_distance_driven.push(item.distance_driven.replace(/,/g, '').replace('km', ''));
			});

			list_distance_driven = list_distance_driven.filter((item, index) => {
				return list_distance_driven.indexOf(item) === index;
			});

			list_distance_driven.sort((a, b) => {
				return a - b;
			});
			res.status(200).json({
				message: 'Get list distance driven success',
				data: list_distance_driven,
				status_code: 200,
				status: true
			});
		} catch (error) {
			res.status(500).json({
				error: error.message,
				error_code: 500,
				message: req.__('Server error')
			});
		}
	}

	async get_fuel_type(req, res) {
		try {
			const list = await CarModel.find().select('fuel_type').sort({ fuel_type: 1 });
			let list_fuel_type = [];
			list.forEach(item => {
				list_fuel_type.push(item.fuel_type);
			});

			list_fuel_type = list_fuel_type.filter((item, index) => {
				return list_fuel_type.indexOf(item) === index;
			});

			res.status(200).json({
				message: 'Get list fuel type success',
				data: list_fuel_type,
				status_code: 200,
				status: true
			});
		} catch (error) {
			res.status(500).json({
				error: error.message,
				error_code: 500,
				message: req.__('Server error')
			});
		}
	}

	async get_gear_box(req, res) {
		try {
			const list = await CarModel.find().select('gearbox').sort({ gearbox: 1 });
			let list_gear_box = [];
			list.forEach(item => {
				list_gear_box.push(item.gearbox);
			});

			list_gear_box = list_gear_box.filter((item, index) => {
				return list_gear_box.indexOf(item) === index;
			});

			res.status(200).json({
				message: 'Get list gear box success',
				data: list_gear_box,
				status_code: 200,
				status: true
			});
		} catch (error) {
			res.status(500).json({
				error: error.message,
				error_code: 500,
				message: req.__('Server error')
			});
		}
	}

	async get_color(req, res) {
		try {
			const list = await CarModel.find().select('color').sort({ color: 1 });
			let list_color = [];
			list.forEach(item => {
				list_color.push(item.color);
			});

			list_color = list_color.filter((item, index) => {
				return list_color.indexOf(item) === index;
			});

			res.status(200).json({
				message: 'Get list color success',
				data: list_color,
				status_code: 200,
				status: true
			});
		} catch (error) {
			res.status(500).json({
				error: error.message,
				error_code: 500,
				message: req.__('Server error')
			});
		}
	}
}

// Path: routes\api\module\filter_list\index.js

module.exports = new FilterListController();
