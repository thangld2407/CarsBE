function isArray(val) {
	if (Array.isArray(val)) {
		return true;
	}
	return false;
}

module.exports = { isArray };
