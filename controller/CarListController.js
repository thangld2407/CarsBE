const convertImageToLinkServer = require('../helper/dowloadImage');
const { pagination } = require('../helper/pagination');
const CarModel = require('../model/CarModel');
const CarTypeModel = require('../model/Category');

class CarsController {
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
			const hasCategory = await CarTypeModel.findOne({
				car_type_name: data.basic_infor.category
			});

			if (hasCarDb.length === 0 && hasCategory) {
				let list_image_converted = [];
				if (data.basic_infor.list_image.length > 0) {
					for (let i = 0; i < data.basic_infor.list_image.length; i++) {
						let link = convertImageToLinkServer(data.basic_infor.list_image[i]);
						list_image_converted.push(link);
					}
				}
				let primary_image_convert = convertImageToLinkServer(
					data.basic_infor.primary_image
				);
				const car = new CarModel({
					images: list_image_converted,
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
					category: hasCategory._id,
					primary_image: primary_image_convert,

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
					status_code: 200
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
	}

	async getListCars(req, res) {
		const { page, limit, filter, sort, search } = req.body;
		let query_filter = {};
		if (!!filter) {
			if (filter.is_hotsale) {
				query_filter = {
					...query_filter,
					is_hotsale: filter.is_hotsale
				};
			}
			if (filter.from_year && filter.to_year) {
				query_filter = {
					...query_filter,
					year_manufacture: {
						$gte: filter.from_year,
						$lte: filter.to_year
					}
				};
			}

			if (filter.category) {
				query_filter = {
					...query_filter,
					category: filter.category
				};
			}
		}

		if (!!search) {
			query_filter = {
				...query_filter,
				car_name: {
					$regex: search,
					$options: 'i'
				}
			};
		}

		let query_sort = {};
		if (!!sort) {
			if (sort.price) {
				query_sort = {
					price: sort.price
				};
			}

			if (sort.year_manufacture) {
				query_sort = {
					year_manufacture: sort.year_manufacture
				};
			}

			if (sort.car_name) {
				query_sort = {
					car_name: sort.car_name
				};
			}

			if (sort.created_at) {
				query_sort = {
					created_at: sort.created_at
				};
			}
		}

		try {
			const count = await CarModel.countDocuments(query_filter);
			let currentPage = parseInt(page) || 1;

			let perPage = parseInt(limit) || 10;
			let paginate = pagination(currentPage, perPage, count);

			const cars = await CarModel.find(query_filter, null, {
				sort: query_sort
			})
				.select(
					'car_name price car_code _id primary_image year_manufacture is_hotsale created_at updated_at'
				)
				.populate('category')
				.limit(paginate.per_page)
				.skip((paginate.current_page - 1) * paginate.per_page);

			return res.status(200).json({
				message: 'Get list cars success',
				data: cars,
				status_code: 200,
				pagination: { ...paginate, total: count }
			});
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	}

	async getListHotsale(req, res) {
		try {
			const cars = await CarModel.find({ is_hotsale: true })
				.select(
					'car_name price car_code _id primary_image year_manufacture is_hotsale created_at updated_at'
				)
				.populate('category');
			res.status(200).json({
				message: 'Get list hotsale success',
				data: cars,
				status_code: 200
			});
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	}

	async getCarDetail(req, res) {
		const { car_id } = req.body;
		try {
			if (!car_id) {
				return res.status(200).json({
					message: 'car_id is required',
					error_code: 101
				});
			}
			const car = await CarModel.findOne({ _id: car_id }).populate('category').lean();
			if (!car) {
				return res.status(200).json({
					message: 'Car not found',
					error_code: 105
				});
			}

			res.status(200).json({
				message: 'Get car detail success',
				data: car,
				status_code: 200
			});
		} catch (error) {
			res.status(500).json({ message: error.message, error_code: 500 });
		}
	}
}

module.exports = new CarsController();
