const { pagination } = require('../../helper/pagination');
const CarModel = require('../../model/CarModel');

module.exports = {
	async saveCarCrawl(req, res) {
		try {
			const { data } = req.body;
			if (!data) {
				return res.status(400).json({
					message: 'Data is required'
				});
			}
			const hasCarDb = await CarModel.find({
				car_code: data.basic_infor.car_code
			});
			if (hasCarDb.length === 0) {
				const car = new CarModel({
					images: data.basic_infor.list_image,
					car_name: data.basic_infor.car_name,
					price: data.basic_infor.price,
					car_code: data.basic_infor.car_code,
					license_plate: data.basic_infor.license_plate,
					year_manufacture: data.basic_infor.year_manufacture,
					distance_driven: data.basic_infor.distance_driven,
					fuel_type: data.basic_infor.fuel_type,
					gearbox: data.basic_infor.gearbox,
					cylinder_capacity: data.basic_infor.cylinder_capacity,
					color: data.basic_infor.color,
					car_type: data.basic_infor.car_type,
					seizure: data.basic_infor.seizure,
					mortgage: data.basic_infor.mortgage,
					presentation_number: data.basic_infor.presentation_number,
					storage_location: data.basic_infor.storage_location,

					seller_name: data.seller.seller_name,
					phone_contact: data.seller.phone_contact,
					employee_number: data.seller.employee_number,
					parking_location: data.seller.parking_location,
					business_address: data.seller.business_address,
					affiliated_company: data.seller.affiliated_company,

					exterior: data.vehicle_detail.exterior,
					guts: data.vehicle_detail.guts,
					safety: data.vehicle_detail.safety,
					convenience: data.vehicle_detail.convenience,

					performance_check: data.vehicle_detail.performance_check
				});
				await car.save();
				res.status(200).json({
					message: 'Save car crawl success',
					status: 200
				});
			} else {
				res.status(200).json({
					message: 'Car is exists',
					status: 201
				});
			}
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	},
	async getListCars(req, res) {
		const { page, limit } = req.query;

		try {
			const count = await CarModel.countDocuments();
			let currentPage = parseInt(page) || 1;

			let perPage = parseInt(limit) || 10;
			let paginate = pagination(currentPage, perPage, count);

			const cars = await CarModel.find({})
				.select('car_name price car_code _id images year_manufacture')
				.limit(paginate.per_page)
				.skip((paginate.current_page - 1) * paginate.per_page);

			return res.status(200).json({
				message: 'Get list cars success',
				data: cars,
				status: 200,
				pagination: { ...paginate, total: count }
			});
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	}
};
