const join = require("path").join;
const merge = require("webpack-merge");
const common = require("./webpack.common");
const CleanPlugin = require("clean-webpack-plugin");

module.exports = merge(common, {
	mode: "development",
	devtool: "inline-source-map",
	devServer: {
		contentBase: join(__dirname, "build"),
		port: 1337
	},
	plugins: process.argv.some(v => v.includes("webpack-dev-server")) ? [] : [
		new CleanPlugin([ join(__dirname, "build") ])
	]
});