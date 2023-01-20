/**
 * This is where you can run code that will run after webpack
 * To note this will ONLY run in production builds
 **/

import favicons from "favicons";
import path from "path";
import fs from "fs";
import "colors";
const fsPromises = fs.promises;

class Faviconator {
	constructor(rootPath, config) {
		this.rootPath = rootPath;
		this.config = config;
		this.source = path.resolve(this.rootPath, this.config.source);
		this.faviconDirectory = path.resolve(this.rootPath, "./favicons");
		this.generatorConfig = null;
		this.setConfig();

		console.log(this.generatorConfig);
		console.log(this.source);
	}

	setConfig() {
		this.generatorConfig = {
			path: path.resolve(this.rootPath, "./favicons"), // Path for overriding default icons path. `string`
			appName: this.config.appName, // Your application's name. `string`
			appShortName: this.config.appShortName, // Your application's short_name. `string`. Optional. If not set, appName will be used
			appDescription: this.config.appDescription, // Your application's description. `string`
			developerName: this.config.developerName, // Your (or your developer's) name. `string`
			developerURL: this.config.developerURL, // Your (or your developer's) URL. `string`
			dir: "auto", // Primary text direction for name, short_name, and description
			lang: "en-US", // Primary language for name and short_name
			background: this.config.background, // Background colour for flattened icons. `string`
			theme_color: this.config.theme_color, // Theme color user for example in Android's task switcher. `string`
			appleStatusBarStyle: "black-translucent", // Style for Apple status bar: "black-translucent", "default", "black". `string`
			display: "standalone", // Preferred display mode: "fullscreen", "standalone", "minimal-ui" or "browser". `string`
			orientation: "any", // Default orientation: "any", "natural", "portrait" or "landscape". `string`
			scope: "/", // set of URLs that the browser considers within your app
			start_url: "/", // Start URL when launching the application from a device. `string`
			version: "1.0", // Your application's version string. `string`
			logging: false, // Print logs to console? `boolean`
			pixel_art: false, // Keeps pixels "sharp" when scaling up, for pixel art.  Only supported in offline mode.
			loadManifestWithCredentials: false, // Browsers don't send cookies when fetching a manifest, enable this to fix that. `boolean`
			icons: {
				// Platform Options:
				// - offset - offset in percentage
				// - background:
				//   * false - use default
				//   * true - force use default, e.g. set background for Android icons
				//   * color - set background for the specified icons
				//   * mask - apply mask in order to create circle icon (applied by default for firefox). `boolean`
				//   * overlayGlow - apply glow effect after mask has been applied (applied by default for firefox). `boolean`
				//   * overlayShadow - apply drop shadow after mask has been applied .`boolean`
				//
				android: true, // Create Android homescreen icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
				appleIcon: true, // Create Apple touch icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
				appleStartup: false, // Create Apple startup images. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
				coast: true, // Create Opera Coast icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
				favicons: true, // Create regular favicons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
				firefox: true, // Create Firefox OS icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
				windows: true, // Create Windows 8 tile icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
				yandex: true, // Create Yandex browser icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
			},
		};
	}

	async run() {
		try {
			console.log("Welcome to Faviconator!".rainbow);

			await this.deleteFaviconDirectory();

			console.log("Creating a fresh favicon Directory");
			await fsPromises.mkdir(`${this.faviconDirectory}`);
			//console.log(response.images); // Array of { name: string, contents: <buffer> }
			//console.log(response.files); // Array of { name: string, contents: <string> }
			//console.log(response.html); // Array of strings (html elements)

			console.log("Generating image files");
			const faviconatorPromise = () => {
				return new Promise((resolve, reject) => {
					favicons(
						this.source,
						this.generatorConfig,
						(error, response) => {
							if (error) {
								reject(error);
							} else {
								resolve(response);
							}
						}
					);
				});
			};

			/**
			 * Data will return
			 * faviconatorData.images - Array of { name: string, contents: <buffer> }
			 * faviconatorData.files - Array of { name: string, contents: <string> }
			 * faviconatorData.html - Array of strings (html elements)
			 */
			let faviconatorData = await faviconatorPromise();

			let filePromises = [];
			faviconatorData.images.forEach((imageObject) => {
				filePromises.push(this.writeFaviconFile(imageObject));
			});

			faviconatorData.files.forEach((imageObject) => {
				filePromises.push(this.writeFaviconFile(imageObject));
			});

			await Promise.all(filePromises);
			console.log("Success!".green.bold);
			console.log("All favicons are in a new favicon directory".bold);
		} catch (error) {
			console.log(
				"Ohh snap it looks like faviconator failed somewhere 😕"
			);
			console.error(error);
		}
	}

	async deleteFaviconDirectory() {
		try {
			console.log("Deleting any existing favicon directory...");

			const files = await fsPromises.readdir(this.faviconDirectory);

			console.log(`deleting ${files.length} files`.red);
			let filePromises = [];
			files.forEach((file) => {
				filePromises.push(
					fsPromises.unlink(path.join(this.faviconDirectory, file))
				);
			});

			// Awaits all the files being nuked
			await Promise.all(filePromises);

			if (fs.existsSync(this.faviconDirectory)) {
				await fsPromises.rmdir(this.faviconDirectory);
			} else {
				console.log("hello");
			}
		} catch (e) {
			if (e.code === "ENOENT") {
				console.error("There is not a favicon directory moving on~");
			} else {
				console.error("Something went wrong deleting the directory");
				console.error(e);
			}
		}
	}

	async writeFaviconFile(fileObject) {
		try {
			const name = fileObject.name;
			const data = fileObject.contents;

			await fsPromises.writeFile(
				path.join(this.faviconDirectory, name),
				data
			);
		} catch (e) {
			console.error("Something went wrong writing this file:");
			console.error(name);
			console.error(e);
		}
	}

	// Runs the main async function
}

export default Faviconator;
