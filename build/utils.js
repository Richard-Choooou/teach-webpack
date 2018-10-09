const path = require('path')

module.exports.getPathByRoot = function (targetPath) {
    return path.resolve(__dirname, '../', targetPath)
}