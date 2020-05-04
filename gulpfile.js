const gulp = require('gulp')

const clean = require('./gulp/tasks/clean')

module.exports.start = gulp.series(clean)
