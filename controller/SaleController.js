const take_decimal_number = require('../helper/floatNumberTwoCharacter');
const CarModel = require('../model/CarModel');
const SaleModel = require('../model/SaleModel');
async function updateCar(car, sale_price) {
	let priceDisplay = car.price_display;
	let priceSale = car.price * (sale_price / 100) || 0;

	let priceDisplayOnCar = take_decimal_number(priceDisplay + priceSale);

	await CarModel.updateOne({ _id: car._id }, { price_display: priceDisplayOnCar });
}
class SaleController {
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
				const saleCreate = new SaleModel({
					is_sale,
					sale_price
				});
				await saleCreate.save();

				if (saleCreate.is_sale) {
					cars.forEach(car => updateCar(car, saleCreate.sale_price));
				}
			} else {
				if (is_sale) {
					await SaleModel.findByIdAndUpdate(isSaleOn[0]._id, {
						sale_price,
						is_sale: true
					});
					cars.forEach(car => updateCar(car, sale_price));
				} else {
					await SaleModel.findByIdAndUpdate(isSaleOn[0]._id, {
						sale_price: 0,
						is_sale: false
					});
					cars.forEach(car => updateCar(car, -sale_price));
				}
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
