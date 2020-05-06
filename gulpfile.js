// Paths & Directories
const dist_folder = 'dist',
	source_folder = '#src'

const path = {
	build: {
		html: dist_folder + '/',
		css: dist_folder + '/css/',
		js: dist_folder + '/js/',
		img: dist_folder + '/img/',
		fonts: dist_folder + '/fonts/',
	},
	src: {
		pug: source_folder + '/pug/**/*.pug',
		css: source_folder + '/styles/style.scss',
		js: source_folder + '/js/main.js',
		img: source_folder + '/img/**/*.{jpg,png,svg,gif,ico,webp}',
		fonts: source_folder + '/fonts/*.ttf',
	},
	watch: {
		html: source_folder + '/pug/**/*.pug',
		css: source_folder + '/styles/**/*.scss',
		js: source_folder + '/js/**/*.js',
		img: source_folder + '/img/**/*.{jpg,png,svg,gif,ico,webp}',
	},
	clean: './' + dist_folder + '/',
}

const gulp = require('gulp'),
	pug = require('gulp-pug'),
	bs = require('browser-sync')

function html() {
	return gulp
		.src(path.src.pug)
		.pipe(pug({ pretty: true }))
		.pipe(gulp.dest(path.build.html))
		.pipe(bs.stream())
}

module.exports.html = html
