/*Hàm lấy số lượng số chỉ định sau dấu phẩy trong JavaScript*/
function take_decimal_number(num, n = 2) {
	//num : số cần xử lý
	//n: số chữ số sau dấu phẩy cần lấy
	let base = 10 ** n;
	let result = Math.round(num * base) / base;
	return result;
}

module.exports = take_decimal_number;
