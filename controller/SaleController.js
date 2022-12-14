const CarModel = require('../model/CarModel');
const SaleModel = require('../model/SaleModel');
async function updateCar(car, sale_price) {
	let price_after;
	if (car.price_display - car.price === 0) {
		price_after = car.price;
	} else {
		price_after = car.price_display;
	}
	console.log('================================================');
	console.log(sale_price);
	console.log(price_after);
	console.log('================================================');

	await CarModel.updateOne(
		{ _id: car._id },
		{ price_display: price_after * (1 - sale_price / 100) }
	);
}
class SaleController {
	isSaleOn = [];
	car_ids = [];

	async setSale(req, res) {
		const { is_sale, sale_price } = req.body;
		if (typeof is_sale !== 'boolean') {
			return res.status(200).json({
				error_code: 101,
				error_message: req.__('is_sale must be boolean'),
				status: false
			});
		}

		if (!sale_price) {
			return res.status(200).json({
				status: false,
				error_code: 101,
				error_message: req.__('sale_price must be required')
			});
		}

		if (typeof sale_price !== 'number') {
			return res.status(200).json({
				status: false,
				error_code: 101,
				error_message: req.__('sale_price must be number')
			});
		}

		try {
			const cars = await CarModel.find();
			if (cars.length === 0) {
				return res.status(200).json({
					status: false,
					error_code: 105,
					error_message: req.__('Cars not found')
				});
			}
			const isSaleOn = await SaleModel.find();

			if (isSaleOn.length === 0) {
				if (is_sale) {
					const sale = new SaleModel({
						is_sale,
						sale_price
					});
					await sale.save();
					cars.forEach(async car => {
						await updateCar(car, sale.sale_price);
					});
				}
			} else {
				let price_update = is_sale === true ? sale_price : 0;

				await SaleModel.findByIdAndUpdate(isSaleOn[0]._id, {
					is_sale,
					sale_price: price_update
				});

				let priceIncreaseOrDecrease =
					is_sale === true ? sale_price : -isSaleOn[0].sale_price;

				cars.forEach(async car => {
					await updateCar(car, priceIncreaseOrDecrease);
				});
			}
			res.status(200).json({
				status: true,
				status_code: 200,
				message: req.__('Set sale successfully')
			});
		} catch (error) {
			res.status(500).json({
				message: 'Server error',
				error: error.message,
				status_code: 500
			});
		}
	}
}

module.exports = new SaleController();
