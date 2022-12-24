const { TYPE_PRICE_DISPLAY } = require('../constants/type');
const { calPercentageSpecific, calculatePriceSpecific } = require('../helper/calculatePrice');
const convertImageToLinkServer = require('../helper/dowloadImage');
const take_decimal_number = require('../helper/floatNumberTwoCharacter');
const generateUUID = require('../helper/generateUUID');
const convertNameToModel = require('../helper/getNameModel');
const htmlToPdf = require('../helper/htmlToPdf');
const isNumberWithValue = require('../helper/isNumber');
const { pagination } = require('../helper/pagination');
const { isArray } = require('../helper/validation');
const CarModel = require('../model/CarModel');
const CarTypeModel = require('../model/Category');
const SaleModel = require('../model/SaleModel');

CarModel.createIndexes({ _id: 1 });
class CarsController {
	async saveCarCrawl(req, res) {
		try {
			const { data } = req.body;
			let isSaleOn = await SaleModel.find();
			let priceSale = 0;
			if (isSaleOn.length === 0) {
				priceSale = 0;
			} else {
				if (isSaleOn[0].is_sale) {
					priceSale = isSaleOn[0].sale_price / 100;
				} else {
					priceSale = 0;
				}
			}

			if (!data) {
				return res.status(400).json({
					message: 'Data is required'
				});
			}
			const hasCarDb = await CarModel.find({
				car_code: data.basic_infor.car_code
			});

			if (hasCarDb.length === 0) {
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

				let htmlPdf;

				if (data.vehicle_detail.performance_check) {
					htmlPdf = await htmlToPdf(data.vehicle_detail.performance_check);
				}

				let price_convert = isNumberWithValue(data.basic_infor.price.replace(/,/g, ''));

				const car = new CarModel({
					images: list_image_converted,
					car_name: data.basic_infor.car_name,
					car_model: convertNameToModel(data.basic_infor.car_name),
					price: price_convert,
					car_code: data.basic_infor.car_code,
					license_plate: data.basic_infor.license_plate,
					year_manufacture: data.basic_infor.year_manufacture,
					distance_driven: isNumberWithValue(
						data.basic_infor.distance_driven.replace(/,/g, '').replace('km', '')
					),
					fuel_type: data.basic_infor.fuel_type,
					gearbox: data.basic_infor.gearbox,
					cylinder_capacity: data.basic_infor.cylinder_capacity,
					color: data.basic_infor.color,
					car_type: data.basic_infor.car_type,
					seizure: data.basic_infor.seizure,
					mortgage: data.basic_infor.mortgage,
					presentation_number: data.basic_infor.presentation_number,
					storage_location: data.basic_infor.storage_location,
					category: data.basic_infor.category,
					primary_image: primary_image_convert,
					price_display: take_decimal_number(price_convert + priceSale * price_convert),

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

					performance_check: [htmlPdf],

					is_data_crawl: true,
					// Add soruce crawl data
					source_crawl: data.source_crawl
				});
				await car.save();
				res.status(200).json({
					message: 'Save car crawl success',
					status_code: 200
				});
			} else {
				let price_convert = isNumberWithValue(data.basic_infor.price.replace(/,/g, ''));

				await CarModel.findOneAndUpdate(
					{ car_code: data.basic_infor.car_code },
					{
						car_name: data.basic_infor.car_name,
						car_model: convertNameToModel(data.basic_infor.car_name),
						price: price_convert,
						car_code: data.basic_infor.car_code,
						license_plate: data.basic_infor.license_plate,
						year_manufacture: data.basic_infor.year_manufacture,
						distance_driven: isNumberWithValue(
							data.basic_infor.distance_driven.replace(/,/g, '').replace('km', '')
						),
						fuel_type: data.basic_infor.fuel_type,
						gearbox: data.basic_infor.gearbox,
						cylinder_capacity: data.basic_infor.cylinder_capacity,
						color: data.basic_infor.color,
						car_type: data.basic_infor.car_type,
						seizure: data.basic_infor.seizure,
						mortgage: data.basic_infor.mortgage,
						presentation_number: data.basic_infor.presentation_number,
						storage_location: data.basic_infor.storage_location,
						category: data.basic_infor.category,
						price_display: take_decimal_number(
							price_convert + priceSale * price_convert
						),

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
						is_data_crawl: true
					}
				);
				res.status(200).json({
					message: 'Car is exists and update field',
					status: 201
				});
			}
		} catch (error) {
			res.status(500).json({
				message: error.message,
				status_code: 500,
				error_message: req.__('Server error')
			});
		}
	}

	async getListCars(req, res) {
		let { page, limit, filter, sort, search } = req.body;

		let query = {};
		let query_sort = {};
		if (filter) {
			const { from_year, to_year } = filter;

			if (from_year && to_year) {
				query = {
					...query,
					year_manufacture: {
						$gte: from_year,
						$lte: to_year
					}
				};
			}

			const { from_price, to_price } = filter;

			if (typeof from_price === 'number' && typeof to_price === 'number') {
				if (from_price > to_price) {
					return res.status(200).json({
						message: req.__('From price must be less than to price'),
						error_code: 104
					});
				}
				if (from_price || to_price) {
					query = {
						...query,
						price: {
							$gte: from_price || to_price
						}
					};
				}
				query = {
					...query,
					price: {
						$gte: from_price,
						$lte: to_price
					}
				};
			}

			const { from_distance, to_distance } = filter;

			if (typeof from_distance === 'number' && typeof to_distance === 'number') {
				if (from_distance > to_distance) {
					return res.status(200).json({
						message: req.__('From distance must be less than to distance'),
						error_code: 104
					});
				}
				if (from_distance || to_distance) {
					query = {
						...query,
						distance_driven: {
							$gte: from_distance || to_distance
						}
					};
				}

				query = {
					...query,
					distance_driven: {
						$gte: from_distance,
						$lte: to_distance
					}
				};
			}

			const { fuel_type } = filter;

			if (fuel_type) {
				query = {
					...query,
					fuel_type
				};
			}

			const { gearbox } = filter;

			if (gearbox) {
				query = {
					...query,
					gearbox
				};
			}

			const { is_data_crawl } = filter;
			if (typeof is_data_crawl === 'boolean') {
				query = {
					...query,
					is_data_crawl
				};
			}

			const { category } = filter;
			if (category) {
				query = {
					...query,
					category
				};
			}

			const { car_model } = filter;
			if (car_model) {
				query = {
					...query,
					car_model
				};
			}

			const { color } = filter;
			if (color) {
				query = {
					...query,
					color
				};
			}

			const { is_hotsale } = filter;
			if (typeof is_hotsale === 'boolean') {
				query = {
					...query,
					is_hotsale
				};
			}
		}
		if (search) {
			query = {
				...query,
				$or: [
					{ car_name: { $regex: search, $options: 'i' } },
					{ license_plate: { $regex: search, $options: 'i' } }
				]
			};
		}

		console.log(query);

		try {
			const count = await CarModel.countDocuments(query);
			let currentPage = parseInt(page) || 1;

			let perPage = parseInt(limit) || 10;
			let paginate = pagination(currentPage, perPage, count);

			const cars = await CarModel.find(query)
				.sort(sort)
				.collation({ locale: 'en_US', numericOrdering: true })
				.select(
					'car_name price license_plate car_code _id primary_image year_manufacture is_hotsale  price_display percentage created_at updated_at color car_type category fuel_type cylinder_capacity is_data_crawl'
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
					'car_name price car_code _id primary_image year_manufacture is_hotsale  price_display percentage created_at updated_at color car_type category fuel_type cylinder_capacity'
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
					status_code: 101
				});
			}
			const car = await CarModel.findOne({ _id: car_id }).populate('category').lean();
			if (!car) {
				return res.status(200).json({
					message: 'Car not found',
					status_code: 105
				});
			}

			res.status(200).json({
				message: 'Get car detail success',
				data: car,
				status_code: 200
			});
		} catch (error) {
			res.status(500).json({ message: error.message, status_code: 500 });
		}
	}

	async updateHotsale(req, res) {
		try {
			const { ids, is_hotsale, data_update } = req.body;
			let dataIdUpdate = [];
			let query = {};
			if (data_update) {
				const { search, filter } = data_update;
				if (search) {
					query = {
						...query,
						$or: [
							{ car_name: { $regex: search, $options: 'i' } },
							{ license_plate: { $regex: search, $options: 'i' } }
						]
					};
				}
				if (filter) {
					query = {
						...query,
						...filter
					};
				}

				const cars = await CarModel.find(query).select('_id').lean();
				dataIdUpdate = cars.map(car => car._id);
			} else {
				if (!ids || ids.length === 0) {
					return res.status(200).json({
						message: 'List cars id is required',
						status_code: 101,
						status: false
					});
				}

				dataIdUpdate = ids;
			}

			if (typeof is_hotsale !== 'boolean' || typeof is_hotsale === 'undefined') {
				return res.status(200).json({
					message: req.__('Yêu cầu trạng thái hotsale'),
					status_code: 101,
					status: false
				});
			}

			for (let i = 0; i < dataIdUpdate.length; i++) {
				const has_cars = await CarModel.findById(dataIdUpdate[i]).lean();
				if (!has_cars) {
					return res.status(200).json({
						message: req.__('Cars not found'),
						status_code: 105,
						status: false
					});
				}
			}

			await CarModel.updateMany({ _id: { $in: dataIdUpdate } }, { is_hotsale: is_hotsale });

			res.status(200).json({
				message: req.__('Cập nhật danh sách hotsale thành công'),
				status_code: 200,
				status: true
			});
		} catch (error) {
			res.status(500).json({ message: error.message, status_code: 500 });
		}
	}

	async updatePrice(req, res) {
		try {
			let isSaleOn = await SaleModel.find();
			let priceSale = 0;
			if (isSaleOn.length === 0) {
				priceSale = 0;
			} else {
				if (isSaleOn[0].is_sale) {
					priceSale = isSaleOn[0].sale_price / 100;
				} else {
					priceSale = 0;
				}
			}
			const { type, percentage, price, ids, data_update } = req.body;

			if (!Object.values(TYPE_PRICE_DISPLAY).includes(type)) {
				return res.status(200).json({
					message: req.__('Loại dữ liệu không chính xác'),
					status_code: 100
				});
			}

			if (type === TYPE_PRICE_DISPLAY.PERCENTAGE) {
				if (!percentage) {
					return res.status(200).json({
						status_code: 101,
						message: req.__('Vui lòng nhập phần % giá tiền')
					});
				}
			}

			if (data_update && typeof data_update === 'object') {
				const { filter, search } = data_update;

				let query = {};

				if (filter) {
					const { from_year, to_year } = filter;

					if (from_year && to_year) {
						query = {
							...query,
							year_manufacture: {
								$gte: from_year,
								$lte: to_year
							}
						};
					}

					const { from_price, to_price } = filter;

					if (typeof from_price === 'number' && typeof to_price === 'number') {
						if (from_price > to_price) {
							return res.status(200).json({
								message: req.__('From price must be less than to price'),
								error_code: 104
							});
						}
						if (from_price || to_price) {
							query = {
								...query,
								price: {
									$gte: from_price || to_price
								}
							};
						}
						query = {
							...query,
							price: {
								$gte: from_price,
								$lte: to_price
							}
						};
					}

					const { from_distance, to_distance } = filter;

					if (typeof from_distance === 'number' && typeof to_distance === 'number') {
						if (from_distance > to_distance) {
							return res.status(200).json({
								message: req.__('From distance must be less than to distance'),
								error_code: 104
							});
						}
						if (from_distance || to_distance) {
							query = {
								...query,
								distance_driven: {
									$gte: from_distance || to_distance
								}
							};
						}

						query = {
							...query,
							distance_driven: {
								$gte: from_distance,
								$lte: to_distance
							}
						};
					}

					const { fuel_type } = filter;

					if (fuel_type) {
						query = {
							...query,
							fuel_type
						};
					}

					const { gearbox } = filter;

					if (gearbox) {
						query = {
							...query,
							gearbox
						};
					}

					const { is_data_crawl } = filter;
					if (typeof is_data_crawl === 'boolean') {
						query = {
							...query,
							is_data_crawl
						};
					}

					const { category } = filter;
					if (category) {
						query = {
							...query,
							category
						};
					}

					const { color } = filter;
					if (color) {
						query = {
							...query,
							color
						};
					}

					const { is_hotsale } = filter;
					if (typeof is_hotsale === 'boolean') {
						query = {
							...query,
							is_hotsale
						};
					}
				}
				if (search) {
					query = {
						...query,
						$or: [
							{ car_name: { $regex: search, $options: 'i' } },
							{ license_plate: { $regex: search, $options: 'i' } }
						]
					};
				}

				const cars = await CarModel.find(query).select('_id price price_display');

				if (cars.length > 0) {
					for (let carIndex = 0; carIndex < cars.length; carIndex++) {
						let priceWillBeDisplay = isSaleOn[0].is_sale
							? cars[carIndex].price_display
							: cars[carIndex].price;
						if (type === TYPE_PRICE_DISPLAY.PERCENTAGE) {
							await CarModel.findByIdAndUpdate(cars[carIndex]._id, {
								percentage: percentage,
								price_display: calPercentageSpecific(
									priceSale,
									priceWillBeDisplay,
									percentage
								),
								difference_price: 0
							});
						}

						if (type === TYPE_PRICE_DISPLAY.PRICE) {
							await CarModel.findByIdAndUpdate(cars[carIndex]._id, {
								price_display: calculatePriceSpecific(
									priceSale,
									priceWillBeDisplay,
									price
								),
								difference_price: price,
								percentage: 0
							});
						}
					}
				} else {
					res.status(200).json({
						message: 'Car not found',
						status_code: 105
					});
				}
			} else {
				if (!ids || ids.length === 0) {
					return res.status(200).json({
						message: 'car_id is required',
						status_code: 101
					});
				}
				for (let i = 0; i < ids.length; i++) {
					const car = await CarModel.findOne({ _id: ids[i] }).lean();
					if (!car) {
						return res.status(200).json({
							message: 'Car not found',
							status_code: 105
						});
					}

					if (!Number(car.price)) {
						return res.status(200).json({
							message: req.__('Vui lòng lựa chọn xe khác với giá tiền là số'),
							status_code: 100
						});
					}

					if (type === TYPE_PRICE_DISPLAY.PERCENTAGE) {
						await CarModel.findByIdAndUpdate(ids[i], {
							percentage: percentage,
							price_display: take_decimal_number(
								car.price * (1 + percentage / 100) + priceSale * car.price
							),
							difference_price: 0
						});
					}

					if (type === TYPE_PRICE_DISPLAY.PRICE) {
						await CarModel.findByIdAndUpdate(ids[i], {
							price_display: take_decimal_number(
								Number(car.price) + price + priceSale * Number(car.price)
							),
							difference_price: price,
							percentage: 0
						});
					}
				}
			}

			res.status(200).json({
				message: req.__('Cập nhật thành công'),
				status: true,
				status_code: 200
			});
		} catch (error) {
			res.status(500).json({ message: error.message, status_code: 500 });
		}
	}

	async create(req, res) {
		try {
			let isSaleOn = await SaleModel.find();
			let priceSale = 0;
			if (isSaleOn.length === 0) {
				priceSale = 0;
			} else {
				if (isSaleOn[0].is_sale) {
					priceSale = isSaleOn[0].sale_price / 100;
				} else {
					priceSale = 0;
				}
			}

			let {
				car_name,
				car_model,
				price,
				car_code,
				license_plate,
				year_manufacture,
				distance_driven,
				fuel_type,
				cylinder_capacity,
				color,
				gearbox,
				category,
				performance_check,
				phone_contact,
				images,
				car_type,
				seizure,
				mortgage,
				presentation_number,
				storage_location,
				exterior,
				guts,
				safety,
				convenience,
				seller_name,
				employee_number,
				affiliated_company,
				business_address,
				parking_location,
				primary_image
			} = req.body;

			if (!car_name) {
				return res.status(200).json({
					message: req.__('Vui lòng nhập tên xe'),
					status_code: 101,
					status: false
				});
			}

			if (!car_model) {
				return res.status(200).json({
					message: req.__('Vui lòng chọn loại xe'),
					status_code: 101,
					status: false
				});
			}

			if (!car_type) {
				return res.status(200).json({
					message: req.__('Vui lòng chọn loại xe'),
					status_code: 101,
					status: false
				});
			}

			if (!price) {
				return res.status(200).json({
					message: req.__('Vui lòng nhập giá xe'),
					status_code: 101,
					status: false
				});
			}

			if (!car_code) {
				car_code = generateUUID();
			}

			if (!license_plate) {
				return res.status(200).json({
					message: req.__('Vui lòng nhập biển số xe'),
					status_code: 101,
					status: false
				});
			}

			if (!year_manufacture) {
				return res.status(200).json({
					message: req.__('Vui lòng nhập năm sản xuất'),
					status_code: 101,
					status: false
				});
			}

			if (!distance_driven) {
				return res.status(200).json({
					message: req.__('Vui lòng nhập số km đã đi'),
					status_code: 101,
					status: false
				});
			}

			if (!fuel_type) {
				return res.status(200).json({
					message: req.__('Vui lòng nhập loại nhiên liệu'),
					status_code: 101,
					status: false
				});
			}

			if (!gearbox) {
				return res.status(200).json({
					message: req.__('Vui lòng nhập hộp số'),
					status_code: 101,
					status: false
				});
			}

			if (!cylinder_capacity) {
				return res.status(200).json({
					message: req.__('Vui lòng nhập dung tích xi lanh'),
					status_code: 101,
					status: false
				});
			}

			if (!color) {
				return res.status(200).json({
					message: req.__('Vui lòng nhập màu xe'),
					status_code: 101,
					status: false
				});
			}

			if (!category) {
				return res.status(200).json({
					message: req.__('Vui lòng nhập danh mục xe'),
					status_code: 101,
					status: false
				});
			}

			if (!isArray(performance_check)) {
				return res.status(200).json({
					message: req.__('Loại dữ liệu kiểm tra hiệu suất nhập vào không đúng'),
					status_code: 104,
					status: false
				});
			}

			if (!isArray(images)) {
				return res.status(200).json({
					message: req.__('Loại dữ liệu ảnh nhập vào không đúng'),
					status_code: 104,
					status: false
				});
			}

			if (guts && !isArray(guts)) {
				return res.status(200).json({
					message: req.__('Loại dữ liệu nội thất nhập vào không đúng'),
					status_code: 104,
					status: false
				});
			}

			if (exterior && !isArray(exterior)) {
				return res.status(200).json({
					message: req.__('Loại dữ liệu ngoại thất nhập vào không đúng'),
					status_code: 104,
					status: false
				});
			}

			if (safety && !isArray(safety)) {
				return res.status(200).json({
					message: req.__('Loại dữ liệu an toàn nhập vào không đúng'),
					status_code: 104,
					status: false
				});
			}

			if (convenience && !isArray(convenience)) {
				return res.status(200).json({
					message: req.__('Loại dữ liệu tiện nghi nhập vào không đúng'),
					status_code: 104,
					status: false
				});
			}

			if (price && typeof price !== 'number') {
				return res.status(200).json({
					message: req.__('Loại dữ liệu giá nhập vào không đúng'),
					status_code: 104,
					status: false
				});
			}

			if (year_manufacture && typeof year_manufacture !== 'number') {
				return res.status(200).json({
					message: req.__('Loại dữ liệu năm sản xuất nhập vào không đúng'),
					status_code: 104,
					status: false
				});
			}

			if (distance_driven && typeof distance_driven !== 'number') {
				return res.status(200).json({
					message: req.__('Loại dữ liệu số km đã đi nhập vào không đúng'),
					status_code: 104,
					status: false
				});
			}

			const hasCarByCarCode = await CarModel.findOne({
				car_code: car_code
			});

			if (hasCarByCarCode) {
				return res.status(200).json({
					message: req.__('Mã xe đã tồn tại'),
					status_code: 102,
					status: false
				});
			}

			const hasCarByLicensePlate = await CarModel.findOne({
				license_plate
			});

			if (hasCarByLicensePlate) {
				return res.status(200).json({
					message: req.__('Mã xe đã tồn tại'),
					status_code: 102,
					status: false
				});
			}

			const newCar = new CarModel({
				car_name,
				price,
				car_code,
				license_plate,
				year_manufacture,
				distance_driven,
				fuel_type,
				cylinder_capacity,
				color,
				gearbox,
				category,
				performance_check,
				phone_contact,
				images,
				car_type,
				seizure,
				mortgage,
				presentation_number,
				storage_location,
				exterior,
				guts,
				safety,
				convenience,
				seller_name,
				employee_number,
				affiliated_company,
				business_address,
				parking_location,
				primary_image,
				price_display: take_decimal_number(price + priceSale * price)
			});

			await newCar.save();

			return res.status(200).json({
				message: req.__('Thêm mới thành công'),
				status: true,
				status_code: 200
			});
		} catch (error) {
			res.status(500).json({
				message: req.__('Server error'),
				error: error.message,
				status_code: 500
			});
		}
	}

	async edit(req, res) {
		try {
			let isSaleOn = await SaleModel.find();
			let priceSale = 0;
			if (isSaleOn.length === 0) {
				priceSale = 0;
			} else {
				if (isSaleOn[0].is_sale) {
					priceSale = isSaleOn[0].sale_price / 100;
				} else {
					priceSale = 0;
				}
			}
			let {
				car_id,
				car_name,
				car_model,
				price,
				license_plate,
				year_manufacture,
				distance_driven,
				fuel_type,
				cylinder_capacity,
				color,
				gearbox,
				category,
				performance_check,
				phone_contact,
				images,
				car_type,
				seizure,
				mortgage,
				presentation_number,
				storage_location,
				exterior,
				guts,
				safety,
				convenience,
				seller_name,
				employee_number,
				affiliated_company,
				business_address,
				parking_location,
				primary_image
			} = req.body;

			const hasCar = await CarModel.findOne({ _id: car_id, is_data_crawl: false }).lean();

			if (!hasCar) {
				return res.status(200).json({
					message: req.__('Car not found'),
					status_code: 102,
					status: false
				});
			}

			if (!car_name) {
				return res.status(200).json({
					message: req.__('Vui lòng nhập tên xe'),
					status_code: 101,
					status: false
				});
			}

			if (!car_model) {
				return res.status(200).json({
					message: req.__('Vui lòng chọn loại xe'),
					status_code: 101,
					status: false
				});
			}

			if (!car_type) {
				return res.status(200).json({
					message: req.__('Vui lòng chọn loại xe'),
					status_code: 101,
					status: false
				});
			}

			if (!price) {
				return res.status(200).json({
					message: req.__('Vui lòng nhập giá xe'),
					status_code: 101,
					status: false
				});
			}

			if (!license_plate) {
				return res.status(200).json({
					message: req.__('Vui lòng nhập biển số xe'),
					status_code: 101,
					status: false
				});
			}

			if (!year_manufacture) {
				return res.status(200).json({
					message: req.__('Vui lòng nhập năm sản xuất'),
					status_code: 101,
					status: false
				});
			}

			if (!distance_driven) {
				return res.status(200).json({
					message: req.__('Vui lòng nhập số km đã đi'),
					status_code: 101,
					status: false
				});
			}

			if (!fuel_type) {
				return res.status(200).json({
					message: req.__('Vui lòng nhập loại nhiên liệu'),
					status_code: 101,
					status: false
				});
			}

			if (!gearbox) {
				return res.status(200).json({
					message: req.__('Vui lòng nhập hộp số'),
					status_code: 101,
					status: false
				});
			}

			if (!cylinder_capacity) {
				return res.status(200).json({
					message: req.__('Vui lòng nhập dung tích xi lanh'),
					status_code: 101,
					status: false
				});
			}

			if (!color) {
				return res.status(200).json({
					message: req.__('Vui lòng nhập màu xe'),
					status_code: 101,
					status: false
				});
			}

			if (!category) {
				return res.status(200).json({
					message: req.__('Vui lòng nhập danh mục xe'),
					status_code: 101,
					status: false
				});
			}

			if (isArray(performance_check)) {
				return res.status(200).json({
					message: req.__('Loại dữ liệu kiểm tra hiệu suất nhập vào không đúng'),
					status_code: 104,
					status: false
				});
			}

			if (!isArray(images)) {
				return res.status(200).json({
					message: req.__('Loại dữ liệu ảnh nhập vào không đúng'),
					status_code: 104,
					status: false
				});
			}

			if (guts && !isArray(guts)) {
				return res.status(200).json({
					message: req.__('Loại dữ liệu nội thất nhập vào không đúng'),
					status_code: 104,
					status: false
				});
			}

			if (exterior && !isArray(exterior)) {
				return res.status(200).json({
					message: req.__('Loại dữ liệu ngoại thất nhập vào không đúng'),
					status_code: 104,
					status: false
				});
			}

			if (safety && !isArray(safety)) {
				return res.status(200).json({
					message: req.__('Loại dữ liệu an toàn nhập vào không đúng'),
					status_code: 104,
					status: false
				});
			}

			if (convenience && !isArray(convenience)) {
				return res.status(200).json({
					message: req.__('Loại dữ liệu tiện nghi nhập vào không đúng'),
					status_code: 104,
					status: false
				});
			}

			if (price && typeof price !== 'number') {
				return res.status(200).json({
					message: req.__('Loại dữ liệu giá nhập vào không đúng'),
					status_code: 104,
					status: false
				});
			}

			if (year_manufacture && typeof year_manufacture !== 'number') {
				return res.status(200).json({
					message: req.__('Loại dữ liệu năm sản xuất nhập vào không đúng'),
					status_code: 104,
					status: false
				});
			}

			if (distance_driven && typeof distance_driven !== 'number') {
				return res.status(200).json({
					message: req.__('Loại dữ liệu số km đã đi nhập vào không đúng'),
					status_code: 104,
					status: false
				});
			}

			await CarModel.findByIdAndUpdate(hasCar._id, {
				car_name,
				price,
				license_plate,
				year_manufacture,
				distance_driven,
				fuel_type,
				cylinder_capacity,
				color,
				gearbox,
				category,
				performance_check,
				phone_contact,
				images,
				car_type,
				seizure,
				mortgage,
				presentation_number,
				storage_location,
				exterior,
				guts,
				safety,
				convenience,
				seller_name,
				employee_number,
				affiliated_company,
				business_address,
				parking_location,
				primary_image,
				price_display: take_decimal_number(price + price * priceSale)
			}).lean();

			return res.status(200).json({
				message: req.__('Cập nhật thông tin xe thành công'),
				status_code: 200,
				status: true
			});
		} catch (error) {
			res.status(500).json({
				message: req.__('Server error'),
				error: error.message,
				status_code: 500
			});
		}
	}

	async delete(req, res) {
		try {
			const { ids, data_update } = req.body;
			let dataIdsUpdate = [];
			let query = {};
			if (data_update) {
				const { search, filter } = data_update;
				if (search) {
					query = {
						...query,
						$or: [
							{ car_name: { $regex: search, $options: 'i' } },
							{ license_plate: { $regex: search, $options: 'i' } }
						]
					};
				}
				if (filter) {
					query = {
						...query,
						...filter
					};
				}

				const cars = await CarModel.find(query).select('_id').lean();
				dataIdsUpdate = cars.map(car => car._id);
			} else {
				if (!ids) {
					return res.status(200).json({
						message: req.__('Vui lòng nhập id xe'),
						status_code: 101,
						status: false
					});
				}
				if (!isArray(ids)) {
					return res.status(200).json({
						message: req.__('Loại dữ liệu id xe nhập vào không đúng'),
						status_code: 104,
						status: false
					});
				}

				dataIdsUpdate = ids;
			}

			for (let i = 0; i < dataIdsUpdate.length; i++) {
				const has_cars = await CarModel.findById(dataIdsUpdate[i]).lean();
				if (!has_cars) {
					return res.status(200).json({
						message: req.__('Cars not found'),
						status_code: 105,
						status: false
					});
				}
			}

			await CarModel.deleteMany({ _id: { $in: ids } });

			return res.status(200).json({
				message: req.__('Delete cars successfully'),
				status_code: 200,
				status: true
			});
		} catch (error) {
			res.status(500).json({
				message: error.message,
				error_message: req.__('Server error'),
				status_code: 500
			});
		}
	}
}

module.exports = new CarsController();
