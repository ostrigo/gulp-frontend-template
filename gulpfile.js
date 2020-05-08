const path = require('./gulp/config')
const { dest, series, parallel, src, watch } = require('gulp')

const pug = require('gulp-pug')
const plumber = require('gulp-plumber')
const bs = require('browser-sync').create()
const autoprefixer = require('autoprefixer')
const postcss = require('gulp-postcss')
const sourcemaps = require('gulp-sourcemaps')
const sass = require('gulp-sass')
const csso = require('gulp-csso')
const rename = require('gulp-rename')
const del = require('del')
const imagemin = require('gulp-imagemin')
const uglify = require('gulp-uglify-es').default
const concat = require('gulp-concat')

function clean(cb) {
	return del(path.clean).then(() => {
		cb()
	})
}

function pug2html() {
	return src(path.src.pug)
		.pipe(pug({ pretty: true }))
		.pipe(dest(path.build.html))
		.pipe(bs.stream())
}

function styles() {
	return src(path.src.css)
		.pipe(plumber())
		.pipe(
			sass({
				outputStyle: 'expanded',
			})
		)
		.pipe(
			postcss([
				autoprefixer({
					overrideBrowserslist: ['last 5 versions'],
					cascade: true,
				}),
			])
		)
		.pipe(dest(path.build.css))
		.pipe(sourcemaps.init())
		.pipe(csso({}))
		.pipe(rename({ suffix: '.min' }))
		.pipe(sourcemaps.write('.'))
		.pipe(dest(path.build.css))
		.pipe(bs.stream())
}

function imageMinify() {
	return src(path.src.img)
		.pipe(
			imagemin(
				[
					imagemin.gifsicle({ interlaced: true }),
					imagemin.mozjpeg({
						quality: 75,
						progressive: true,
					}),
					imagemin.optipng({ optimizationLevel: 5 }),
					imagemin.svgo({
						plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
					}),
				],
				{ verbose: true }
			)
		)
		.pipe(dest(path.build.img))
		.pipe(bs.stream())
}

function js() {
	src(path.src.vendorJs).pipe(concat('libs.min.js')).pipe(dest(path.build.js))
	return src(path.src.mainJs)
		.pipe(uglify())
		.pipe(dest(path.build.js))
		.pipe(bs.stream())
}

function serve(cb) {
	bs.init({
		server: path.build.html,
		notify: false,
		open: true,
		cors: true,
	})

	watch([path.watch.html], pug2html)
	watch([path.watch.css], styles)
	watch([path.watch.img], imageMinify)
	watch([path.watch.js], js)

	return cb()
}

module.exports.html = pug2html
module.exports.styles = styles
module.exports.clean = clean
module.exports.serve = serve
module.exports.img = imageMinify
module.exports.js = js

// const dev = parallel(fonts)
const dev = parallel(pug2html, styles, imageMinify, js)
const build = series(clean, dev)

module.exports.start = series(build, serve)
module.exports.default = series(build, serve)
module.exports.build = series(build)
