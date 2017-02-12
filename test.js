import path from 'path';
import fs from 'fs';
import rimraf from 'rimraf';
import test from 'ava';
import tempfile from 'tempfile';
import multicopy from './';

function ensureDirectoryExistence(filepath) {
	const dirname = path.dirname(filepath);
	if (fs.existsSync(dirname)) {
		return true;
	}
	ensureDirectoryExistence(dirname);
	fs.mkdirSync(dirname);
}

function fixture(src, files) {
	files.forEach(file => {
		const filepath = path.join(src, file);
		ensureDirectoryExistence(filepath);
		fs.writeFileSync(filepath, '');
	});
}

function missingFiles(dest, files) {
	return files.map(file => {
		const filepath = path.join(dest, file);
		return fs.existsSync(filepath) ? false : file;
	}).filter(item => item);
}

test.beforeEach(t => {
	t.context.src = tempfile();
	t.context.dest = tempfile();
});

test.afterEach(t => {
	rimraf.sync(t.context.src);
	rimraf.sync(t.context.dest);
});

test('single file is copied', async t => {
	const basename = 'foo.txt';
	fixture(t.context.src, [basename]);

	await multicopy({
		from: t.context.src,
		to: t.context.dest,
		files: basename
	});

	const destname = path.join(t.context.dest, basename);
	const exists = fs.existsSync(destname);
	t.true(exists);
});

test('files from one src are copied to one dest', async t => {
	const files = ['foo.txt', 'two/bar.txt'];
	fixture(t.context.src, files);

	await multicopy({
		from: t.context.src,
		to: t.context.dest,
		files: files
	});

	const missing = missingFiles(t.context.dest, files);
	t.deepEqual(missing, []);
});
