const Path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const pages = [ 'a', 'b'];
const pagesEntry= pages.reduce((config, page) => {
	config[page] = Path.resolve(__dirname,`../src/scripts/${page}.js`);
	return config;
}, {});

module.exports = {
	entry: {
		index: Path.resolve(__dirname, '../src/scripts/index.js'),
		...pagesEntry
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
			excludeChunks: [...pages]
		}),
	].concat(
		pages.map(
			(page) =>
				new HtmlWebpackPlugin({
					template: Path.resolve(__dirname, `../src/${page}.html`),
					inject: 'body',
					filename: `${page}.html`,
					chunks: ['index', page],
				})
		)
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
