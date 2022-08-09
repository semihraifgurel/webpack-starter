const Path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const pages = ['index', 'a', 'b'];
const pagesWithoutIndex = pages.filter((key) => key !== 'index');
const pagesEntry = pages.reduce((config, page) => {
	config[page] = Path.resolve(__dirname, `../src/scripts/pages/${page}.js`);
	return config;
}, {});

module.exports = {
	entry: {
		core: Path.resolve(__dirname, '../src/scripts/core.js'),
		...pagesEntry,
	},
	output: {
		path: Path.join(__dirname, '../build'),
		filename: 'js/[name].js',
	},
	optimization: {
		splitChunks: {
			chunks: 'all',
			name: false,
		},
	},
	plugins: [
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin({
			patterns: [{ from: Path.resolve(__dirname, '../public'), to: 'public' }],
		}),
		new HtmlWebpackPlugin({
			template: Path.resolve(__dirname, '../src/index.html'),
			inject: 'body',
			excludeChunks: [...pagesWithoutIndex],
			favicon: Path.resolve(__dirname, '../src/favicon.ico'),
		}),
	].concat(
		pagesWithoutIndex.map(
			(page) =>
				new HtmlWebpackPlugin({
					template: Path.resolve(__dirname, `../src/pages/${page}.html`),
					inject: 'body',
					filename: `${page}.html`,
					chunks: ['core', page],
				}),
		),
	),
	resolve: {
		alias: {
			'~': Path.resolve(__dirname, '../src'),
		},
	},
	module: {
		rules: [
			{
				test: /\.mjs$/,
				include: /node_modules/,
				type: 'javascript/auto',
			},
			{
				test: /\.html$/i,
				loader: 'html-loader',
			},
			{
				test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
				type: 'asset',
			},
		],
	},
};
