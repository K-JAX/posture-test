import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import path from "path";
import { fileURLToPath } from "url";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CopyPlugin from "copy-webpack-plugin";
import ImageMinimizerPlugin from "image-minimizer-webpack-plugin";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import sortMediaQueries from "postcss-sort-media-queries";
import chokidar from "chokidar";
import sass from "sass";
import { CleanWebpackPlugin } from "clean-webpack-plugin";

function log(message) {
	console.log("Platform: ".green.bold + message.toString());
}
const __dirname = path.dirname(fileURLToPath(import.meta.url));
/****************************
 * General webpack settings *
 ****************************/

class Compiler {
	constructor(rootPath, isProd, config) {
		this.rootPath = rootPath;
		this.config = config;
		this.devServerConfig = null;
		this.isProd = isProd;
		this.revisionAssets = this.config.revisionAssets === undefined ? true : this.config.revisionAssets;
		this.parseConfig();
		this.webpackConfig = null;
		this.setWebpackConfig();
	}

	parseConfig() {
		// Absolute paths the entries
		const entries = {};

		Object.keys(this.config.entries).forEach((key) => {
			entries[key] = this.config.entries[key].map((entry) => {
				return path.resolve(this.rootPath, entry);
			});
		});
		this.config.entries = entries;

		// Make sure assets aren't revisioned when in dev mode
		if (!this.isProd) {
			this.revisionAssets = false;
		}

		if (this.config.resolve) {
			const resolve = {};
			Object.keys(this.config.resolve).forEach((key) => {
				resolve[key] = path.resolve(this.rootPath, this.config.resolve[key]);
			});
			this.config.resolve = resolve;
		}

		// Make sure a missing externals does not crash platform
		if (!this.config.externals) {
			this.config.externals = {};
		}

		// Absolute path input/output
		this.config.inputFilePath = path.resolve(this.rootPath, this.config.inputFilePath);
		this.config.outputFilePath = path.resolve(this.rootPath, this.config.outputFilePath);

		this.config.devtool = this.isProd ? "" : "source-map";

		this.devServerConfig = {
			// Scans for changes in php files and triggers live-reloads
			onListening: function (devServer) {
				chokidar
					.watch([`*.php`, `./**/*.php`, `./**/**/*.php`], {
						followSymlinks: true,
						usePolling: false,
						ignoreInitial: true,
					})
					.on("all", () => {
						log("PHP File change detected. Reloading browser...");
						devServer.sendMessage(devServer.webSocketServer.clients, "content-changed");
					});
			},
			devMiddleware: {
				publicPath: this.config.publicPath,
				writeToDisk: true,
			},
			hot: true,
			compress: false,
			liveReload: false,
			client: {
				overlay: false,
			},
			host: "0.0.0.0",
			port: this.config.port,
			webSocketServer: "ws",
			allowedHosts: ["all"],
		};
	}

	setWebpackConfig() {
		this.webpackConfig = {
			// Tells where webpack where it is running
			context: __dirname,
			// Voodoo webpack magic necessary since we set mode ourselves
			mode: this.isProd ? "production" : "development",

			// defines files that are root modules within our source
			entry: this.config.entries,

			// Aliases for modules
			resolve: {
				alias: this.config.resolve,
			},

			// Experiments adds top level await support!
			experiments: {
				topLevelAwait: true,
			},

			stats: {
				warnings: false,
			},

			externals: this.config.externals,

			optimization: {
				usedExports: true,
			},

			// Source Maps
			devtool: "source-map",

			// All of our loaders/plugins they live in webpack.plugins.js
			plugins: [
				// deletes the dist folder
				new CleanWebpackPlugin(),
				// Ensures all css gets sent to it's own file instead of a JS file
				new MiniCssExtractPlugin({
					filename: this.revisionAssets ? "./css/[name].[contenthash].css" : "./css/[name].css",
					chunkFilename: "./css/[id].css",
				}),
				//Copies all images from src to dist
				new CopyPlugin({
					patterns: [
						{
							from: path.resolve(this.config.inputFilePath, "./images/"),
							to: path.resolve(this.config.outputFilePath, "./images/"),
						},
					],
				}),
				// Minimizes images in production
				new ImageMinimizerPlugin({
					minimizer: {
						implementation: ImageMinimizerPlugin.imageminMinify,
						options: {
							// Lossy optimization with custom option
							plugins: [
								["gifsicle", { interlaced: true }],
								["mozjpeg", { progressive: true, quality: 80 }],
								["pngquant", { optimizationLevel: 5 }],
								[
									"svgo",
									{
										plugins: [
											{
												removeViewBox: false,
											},
											{
												removeTitle: false,
											},
											{
												removeDesc: false,
											},
											{
												removeUnknownsAndDefaults: false,
											},
										],
									},
								],
							],
						},
					},
				}),
			],

			// Modules are the file testers for all our root modules
			module: {
				rules: [
					{
						test: /\.([jt]sx?)?$/,
						use: {
							loader: "swc-loader",
							options: {
								jsc: {
									parser: {
										syntax: "ecmascript",
										jsx: true,
										dynamicImport: true,
										privateMethod: true,
										functionBind: true,
										exportDefaultFrom: true,
										exportNamespaceFrom: true,
										decorators: true,
										decoratorsBeforeExport: true,
										topLevelAwait: true,
										importMeta: true,
									},
									transform: null,
									target: "es2016",
									loose: false,
									externalHelpers: false,
									// Requires v1.2.50 or upper and requires target to be es2016 or upper.
									keepClassNames: false,
								},
							},
						},
						exclude: /node_modules/,
					},
					{
						test: /\.(sa|sc|c)ss$/,
						use: [
							{
								loader: MiniCssExtractPlugin.loader,
							},
							{
								loader: "css-loader",
								options: {
									importLoaders: 1,
								},
							},
							{
								loader: "postcss-loader",
								options: {
									postcssOptions: (loader) => {
										return {
											plugins: [
												autoprefixer(),
												this.isProd ? cssnano() : "",
												sortMediaQueries({
													sort: "mobile-first",
												}),
											],
										};
									},
								},
							},
							{
								loader: "sass-loader",
								options: {
									implementation: sass,
									sassOptions: {
										fiber: false,
										quiet: true,
										quietDeps: true,
										logger: {
											warn(message, options) {
												// silence is bliss
											},
										},
									},
								},
							},
						],
					},
					{
						test: /\.(jpe?g|png|gif|svg)$/i,
						type: "asset/resource",
						generator: {
							filename: "images/[name][ext]",
						},
					},
					{
						test: /.(ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
						type: "asset/resource",
						generator: {
							filename: "fonts/[name][ext]",
						},
					},
				],
			},

			// Defines the directory for the dist folder and oddly ONLY JS files...
			// CSS/Images/fonts output are defined in plugins
			output: {
				path: path.resolve(this.rootPath, this.config.outputFilePath),
				filename: this.revisionAssets ? "./js/[name].bundle.[contenthash].js" : "./js/[name].bundle.js",
				publicPath: this.config.publicPath,
			},
		};
	}

	/**
	 * Compiles a production ready bundle
	 */
	run() {
		const compiler = webpack(this.webpackConfig);
		compiler.run((err, stats) => {
			console.log(
				stats.toString({
					chunks: false,
					colors: true,
				})
			);
		});
	}

	/**
	 * Compiles and watches in development mode
	 */
	watch() {
		const compiler = webpack(this.webpackConfig);

		const server = new WebpackDevServer(this.devServerConfig, compiler);

		server.start(this.config.port, "0.0.0.0", (err) => {
			if (err) {
				console.error(err);
			}
			console.log("The dev-server is listening on port: ", this.config.port);
		});
	}
}

export default Compiler;
