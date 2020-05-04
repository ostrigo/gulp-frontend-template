const del = require('del')

// Completely delete the dist folder

module.exports = function clean(cb) {
	return del('dist').then(() => {
		cb()
	})
}
