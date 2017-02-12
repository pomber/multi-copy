import path from 'path';
import fs from 'fs';
import rimraf from 'rimraf';
import test from 'ava';
import tempfile from 'tempfile';
import multicopy from './';

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
	const filename = path.join(t.context.src, basename);
	fs.mkdirSync(t.context.src);
	fs.writeFileSync(filename);

	await multicopy({
		from: t.context.src,
		to: t.context.dest,
		files: basename
	});

	const destname = path.join(t.context.dest, basename);
	const exists = fs.existsSync(destname);
	t.true(exists);
})

