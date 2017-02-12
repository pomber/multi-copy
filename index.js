const path = require('path');
const cpy = require('cpy');
const arrify = require('arrify');

module.exports = config => {
	const files = arrify(config.files);
	const promises = files.map(file => {
		return cpy(
			path.join(config.from, file),
			path.join(config.to, file));
	});
	return Promise.all(promises);
};
