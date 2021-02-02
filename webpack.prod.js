const join = require("path").join;
const merge = require("webpack-merge");
const common = require("./webpack.common");
const CleanPlugin = require("clean-webpack-plugin");

module.exports = merge(common, {
	mode: "production",
	devtool: "source-map",
	plugins: [
		new CleanPlugin([ join(__dirname, "./build") ])
	]
});