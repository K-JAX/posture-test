#!/usr/bin/env node

import { Command } from "commander";
import Compiler from "./platform.webpack.js";
import { fileURLToPath, pathToFileURL } from "url";
import path from "path";
import fs from "fs";
import { kill } from "cross-port-killer";
import "colors";

function log(message) {
	console.log("Platform: ".green.bold + message.toString());
}

function errorLog(message) {
	console.log("Platform: ".red.bold + message.toString());
}

log(`Platform is running in this directory: ${process.cwd()}`);

const program = new Command();
program.version("1.2.0");

class Platform {
	constructor() {
		this.currentDirectory = process.cwd();
		this.platformDirectory = path.dirname(fileURLToPath(import.meta.url));
		this.oldConfig = null;
		this.config = null;
	}

	async main() {
		/** START COMMAND **/
		program
			.command("start")
			.alias("s")
			.description(
				"Starts a local webpack dev-mode bundler managed by platform"
			)
			.action(await this.startHandler.bind(this));

		/** BUILD COMMAND **/
		program
			.command("build")
			.alias("b")
			.description(
				"Bakes all the assets into a production ready bundle 🍪"
			)
			.action(await this.buildHandler.bind(this));

		/** INSTALL COMMAND **/
		program
			.command("install")
			.alias("i")
			.description(
				"Installs a fresh copy of WordPress and PosturePress in an empty directory"
			)
			.action(await this.installHandler.bind(this));

		/** FAVICONATOR COMMAND **/
		program
			.command("faviconator")
			.alias("f")
			.description("Generates Favicons!")
			.action(await this.faviconatorHandler.bind(this));

		// Runs the CLI
		await program.parseAsync(process.argv);
	}

	/**
	 * The initialization method to get the config for
	 * both the start/build/faviconator Handler
	 * @returns {Promise<void>}
	 */
	async init() {
		console.log(
			`
========================================================
 _____  __     _____  _____  _____  _____  _____  _____
|  _  ||  |   |  _  ||_   _||   __||     || __  ||     |
|   __||  |__ |     |  | |  |   __||  |  ||    -|| | | |
|__|   |_____||__|__|  |_|  |__|   |_____||__|__||_|_|_|
========================================================

	`.bold.green
		);

		// Start off making sure a config exists
		let configExists = fs.existsSync(
			path.resolve(this.currentDirectory, "platform.config.json")
		);
		let oldConfigExists = fs.existsSync(
			path.resolve(this.currentDirectory, "platform.config.mjs")
		);

		if (configExists) {
			try {
				this.config = JSON.parse(
					fs.readFileSync(
						path.resolve(
							this.currentDirectory,
							"platform.config.json"
						),
						{
							encoding: "utf-8",
						}
					)
				);

				log("Config found");
			} catch (error) {
				errorLog(error);
				errorLog("There is an error in the platform.config.json");
				process.exit(-1);
			}
		}

		// Check for old config and replace with new config format
		else if (oldConfigExists && !configExists) {
			log("In platform 1.1+ the config has moved over to json");
			log("This will allow future features to be implemented easily");
			log(
				"Platform will now move your config to the new json format and delete the old config"
			);
			log("...");

			const oldConfigPath = pathToFileURL(
				path.resolve(this.currentDirectory, "platform.config.mjs")
			);

			// Grab the old platformConfig.mjs file
			let oldPlatformConfig = await import(oldConfigPath.href);
			oldPlatformConfig = oldPlatformConfig.default;
			let newPlatformConfig = null;

			try {
				newPlatformConfig = JSON.parse(
					fs.readFileSync(
						path.resolve(
							this.platformDirectory,
							"platform.config.json"
						),
						{
							encoding: "utf-8",
						}
					)
				);
			} catch (error) {
				errorLog(error);
				errorLog("No default config was found in the platform folder");
				process.exit(-1);
			}

			this.config = { ...newPlatformConfig, ...oldPlatformConfig };

			log(
				"New config has been created. Writing config to the current directory"
			);

			// Write the merged config to the new directory
			try {
				fs.writeFileSync(
					path.resolve(this.currentDirectory, "platform.config.json"),
					JSON.stringify(this.config, null, "\t")
				);
			} catch (error) {
				errorLog(error);
				errorLog(
					"Failed to write the merged config. Refer to the error above"
				);
				process.exit(-1);
			}

			log(
				"Success! Platform will now use only the platform.config.json file"
			);

			log("Deleting the .mjs config...");

			try {
				fs.unlinkSync(
					path.resolve(this.currentDirectory, "platform.config.mjs")
				);
			} catch (error) {
				errorLog(error);
				errorLog(
					"Not able to delete previous config file. Refer to the error above"
				);
				process.exit(-1);
			}
		} else {
			log("It looks like this is a brand new project");
			log("Checking to see if there is a src folder");

			if (fs.existsSync(path.resolve(this.currentDirectory, "./src/"))) {
				log(
					"There is a src folder! Copying in a default Platform config"
				);

				try {
					fs.copyFileSync(
						path.resolve(
							this.platformDirectory,
							"platform.config.json"
						),
						path.resolve(
							this.currentDirectory,
							"platform.config.json"
						)
					);
				} catch (error) {
					errorLog(error);
					errorLog(
						"Failed to copy Platform config! Refer to the error above"
					);
					process.exit(-1);
				}

				log("Default successfully copied");
				log(
					"Exiting, please edit the config if needed or rerun Platform to get started"
				);
				process.exit(0);
			}
		}
	}

	/**
	 * Starts the webpack bundler in dev mode
	 *
	 * @returns {Promise<void>}
	 */
	async startHandler() {
		// Get the config
		await this.init();

		log(
			`Killing all processes on Port ${this.config.port}, to change this port refer to the port key in platform.config.json`
				.red.underline
		);
		await kill(this.config.port);

		const compiler = new Compiler(
			this.currentDirectory,
			false,
			this.config
		);
		log("Starting Webpack in watch mode:");
		compiler.watch();
	}

	/**
	 * Runs webpack in production mode
	 *
	 * @returns {Promise<void>}
	 */
	async buildHandler() {
		// Get the config
		await this.init();

		const compiler = new Compiler(this.currentDirectory, true, this.config);
		log("Starting Webpack in build mode:");
		compiler.run();
	}

	/**
	 * Builds the favicons for a project
	 *
	 * @returns {Promise<void>}
	 */
	async faviconatorHandler() {
		const filePath = pathToFileURL(
			path.resolve(this.platformDirectory, "faviconator.js")
		).href;
		let Faviconator = await import(filePath);
		Faviconator = Faviconator.default;
		await this.init();

		const faviconator = new Faviconator(
			process.cwd(),
			this.config.faviconator
		);

		await faviconator.run();
	}

	async installHandler() {
		const filePath = pathToFileURL(
			path.resolve(this.platformDirectory, "platform.install.js")
		).href;
		let PlatformInstall = await import(filePath);
		PlatformInstall = PlatformInstall.default;
		await PlatformInstall.install();
	}
}

// Initialize and run the Platform CLI
const platform = new Platform();
platform.main();
