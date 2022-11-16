function isNumberWithValue(val) {
	if (!Number(val)) {
		return 0;
	}

	return Number(val);
}

module.exports = isNumberWithValue;
