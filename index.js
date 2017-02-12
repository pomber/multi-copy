const path = require('path');
const cpy = require('cpy');
const arrify = require('arrify');

function join(a, b) {
	if (!a) {
		return b;
	} else if (!b) {
		return a;
	}
	return path.join(a, b);
}

function multicopy(src, dest, configs) {
	const items = arrify(configs);

	const promises = items.map(item => {
		if (typeof item === 'string') {
			return cpy(join(src, item), dest);
		}
		const newSrc = join(src, item.from);
		const newDest = join(dest, item.to);
		return multicopy(newSrc, newDest, item.files);
	});

	return Promise.all(promises);
}

module.exports = config => {
	return multicopy(config.from, config.to, config.files)
		.then(() => config.to);
};
