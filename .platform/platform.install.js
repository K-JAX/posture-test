//import crypto from "crypto";
import path from "path";
import fs from "fs";
import https from "https";
import { fileURLToPath, pathToFileURL } from "url";
import "colors";
import AdmZip from "adm-zip";
import readline from "readline";
import simpleGit from "simple-git";

function log(message) {
	console.log("Platform: ".green.bold + message.toString());
}

function errorLog(message) {
	console.log("Platform: ".red.bold + message.toString());
}

/*
const generatePassword = (
	length = 20,
	wishlist = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$"
) =>
	Array.from(crypto.randomFillSync(new Uint32Array(length)))
		.map((x) => wishlist[x % wishlist.length])
		.join("");
*/

const install = {
	// Database configuration
	databaseHost: "127.0.0.1",
	databasePort: "3306",
	databasePassword: "",
	databaseName: "Wordpress_wp",

	// Site configurations
	siteName: "Wordpress Site",
	title: "Best site ever!",
	adminUser: "postureadmin",
	// Leave blank for a randomly generated password 🙌
	adminPassword: "",
};

class PlatformInstall {
	constructor() {
		this.currentDirectory = process.cwd();
		this.platformDirectory = path.dirname(fileURLToPath(import.meta.url));
		this.wordpressURL = "https://wordpress.org/latest.zip";
		this.wordpressZipFile = null;
		this.themeDirectory = path.resolve(
			this.currentDirectory,
			"./wp-content/themes/"
		);

		this.childGitURL =
			"https://github.com/PostureDev/posturepress2-child-theme.git";
		this.parentGitURL = "https://github.com/PostureDev/PosturePress2.git";

		this.gitUser = null;
		this.gitPassword = null;

		this.git = null;
	}

	/**
	 * Main flow controller of the install script
	 *
	 * @returns {Promise<boolean>}
	 */
	async install() {
		try {
			log("Checking directory...");
			await this.sanityCheck();

			log(
				"Looks good, continuing to install Wordpress/PosturePress".green
			);

			log("Downloading Wordpress Zip...");
			await this.getWordpressZip();

			log("Unpacking wordpress Zip...");
			await this.unpackWordpress();

			//log("Success! Asking for Posture Git credentials:");
			//await this.getCredentials();

			log("Setting up base git repo...");
			await this.setupGit();

			log("Pulling Child Theme...");
			await this.setPPChild();

			log("Pulling Parent Theme...");
			await this.setPPParent();

			log("PosturePress has been installed!".green);

			return true;
		} catch (error) {
			console.error(error);
			errorLog("The installation was not successful. Exiting");
			process.exit(-1);
		}
	}

	/**
	 * Prevents the install script from running in inappropriate situations
	 * stops when any of these are found:
	 * git directories, child themes, package.json etc...
	 * @returns {Promise<void>}
	 */
	async sanityCheck() {
		if (fs.existsSync(path.resolve(this.currentDirectory, "./.git"))) {
			throw new Error(
				"Platform expects a directory with no git tracking to install"
			);
		} else if (
			fs.existsSync(path.resolve(this.currentDirectory, "./wp-content"))
		) {
			throw new Error("Looks like Wordpress has been already installed");
		} else if (
			fs.existsSync(path.resolve(this.currentDirectory, "./package.json"))
		) {
			throw new Error("There is a package.json here, aborting...");
		} else if (
			fs.existsSync(
				path.resolve(this.currentDirectory, "./platform.config.json")
			)
		) {
			throw new Error(
				"Looks like this was run in a child theme folder, aborting..."
			);
		}
	}

	/**
	 * Downloads a wordpress.zip from wordpress.org
	 *
	 * @returns {Promise<unknown>}
	 */
	async getWordpressZip() {
		return new Promise((resolve, reject) => {
			const filePath = pathToFileURL(
				path.resolve(this.currentDirectory, "wordpress.zip")
			);
			const fileStream = fs.createWriteStream(filePath);
			const downloadStream = https.get(this.wordpressURL, (response) => {
				if (response.statusCode !== 200) {
					console.log(response);
					reject(
						new Error(
							"Wordpress Server is down or there is no internet connection"
						)
					);
				}
				response.pipe(fileStream);
			});

			fileStream.on("finish", () => {
				this.wordpressZipFile = filePath;
				resolve(filePath);
			});

			fileStream.on("error", (error) => {
				reject(error);
			});
		});
	}

	/**
	 * Runs a unzip operation to unpack Wordpress
	 * Cleans up leftover files
	 *
	 * @returns {Promise<unknown>}
	 */
	async unpackWordpress() {
		// Synchronous/callback layout is a bit easier to read here so the whole function is wrapped in a promise
		return new Promise((resolve, reject) => {
			try {
				const zip = new AdmZip(this.wordpressZipFile.pathname);
				zip.extractAllTo(this.currentDirectory, true, false);
				const wordpressDir = path.resolve(
					this.currentDirectory,
					"./wordpress"
				);
				const wordpressFiles = fs.readdirSync(wordpressDir);

				wordpressFiles.forEach((file) => {
					return fs.renameSync(
						path.resolve(wordpressDir, file),
						path.resolve(this.currentDirectory, file)
					);
				});

				log("Cleaning up...");

				fs.rmSync(path.resolve(this.currentDirectory, "./wordpress"), {
					recursive: true,
				});
				fs.rmSync(
					path.resolve(this.currentDirectory, "./wordpress.zip")
				);

				resolve(true);
			} catch (error) {
				errorLog("Zip unpack failed");
				reject(error);
			}
		});
	}

	/**
	 * Asks the command line for git credentials
	 * // NOTE: NOT USED because git does not easily support this. A great example of command line input though
	 * @returns {Promise<void>}
	 */
	async getCredentials() {
		let credInput = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});

		const userPromise = new Promise((resolve, reject) => {
			credInput.question("Git Username: ", (input) => {
				this.gitUser = input;
				resolve();
			});
		});

		await userPromise;

		const passwordPromise = new Promise((resolve, reject) => {
			// Hide password characters
			const stdin = process.openStdin();
			process.stdin.on("data", (char) => {
				char = char + "";
				switch (char) {
					case "\n":
					case "\r":
					case "\u0004":
						stdin.pause();
						break;
					default:
						process.stdout.clearLine();
						readline.cursorTo(process.stdout, 0);
						process.stdout.write("Git Password: ");
						break;
				}
			});
			credInput.question(
				"Git Password (To note GitHub only accepts tokens): ",
				(input) => {
					this.gitPassword = input;
					resolve();
				}
			);
		});
		await passwordPromise;
	}

	/**
	 * Sets up a git repo at the current directory
	 * Adds a .gitignore from Platform
	 *
	 * @returns {Promise<void>}
	 */
	async setupGit() {
		try {
			fs.copyFileSync(
				path.resolve(
					this.platformDirectory,
					"./posturepress.gitignore"
				),
				path.resolve(this.currentDirectory, "./.gitignore")
			);
		} catch (error) {
			errorLog("Unable to copy git ignore to wordpress directory");
			console.error(error);
			process.exit(-1);
		}

		this.git = simpleGit({
			baseDir: this.currentDirectory,
		});

		this.git.init();
	}

	/**
	 * Pulls the Child theme and removes git tracking
	 *
	 * @returns {Promise<void>}
	 */
	async setPPChild() {
		const childFolder = path.resolve(
			this.themeDirectory,
			"./posturepress2-child"
		);
		try {
			fs.mkdirSync(childFolder);
		} catch (error) {
			errorLog("Unable to make PosturePress-Child directory. Exiting...");
			console.error(error);
			process.exit(-1);
		}
		try {
			const childGit = simpleGit({
				baseDir: childFolder,
			});

			await childGit
				.init()
				.addRemote("origin", this.childGitURL)
				.pull("origin", "master");

			log(
				"Successfully pulled Child Theme. Removing git tracking and .gitignore..."
			);
			fs.rmSync(path.resolve(childFolder, "./.git"), { recursive: true });
			fs.rmSync(path.resolve(childFolder, "./.gitignore"));
		} catch (error) {
			errorLog("Something went wrong in the git operation");
			console.log(error);
			process.exit(-1);
		}
	}

	/**
	 * Pulls the github repo containing the Parent theme
	 * Sets the repo as a submodule of the main git
	 *
	 * @returns {Promise<void>}
	 */
	async setPPParent() {
		const parentFolder = "wp-content/themes/posturepress2";
		try {
			await this.git.submoduleAdd(this.parentGitURL, parentFolder);

			log("Successfully pulled the Parent Theme");
		} catch (error) {
			errorLog("Something went wrong in the parent git operation");
			console.error(error);
		}
	}
}

const platformInstall = new PlatformInstall();

export default platformInstall;
