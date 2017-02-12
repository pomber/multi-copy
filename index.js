const path = require('path');
const cpy = require('cpy');

module.exports = config => {
	return cpy(
		path.join(config.from, config.files),
		path.join(config.to, config.files));
};
