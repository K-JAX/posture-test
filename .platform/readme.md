# Platform
A global webpack bundler and utility CLI

## Install
To install Platform follow the steps below

### Requirements
Node 14+

(optional) pnpm already installed

```bash
cd ~/

mkdir Platform

cd ./Platform/

git clone https://github.com/PostureDev/platform.git

pnpm install

# Test in a new terminal to see if the cli installed correctly
platform

# If no command was found try:
pnpm link
```

---

## Commands

```bash
# Installs a fresh copy of WordPress and PosturePress2 with git tracking/submodules setup!
platform install

# Start is the equivalent of npm start
# This will eventually be mapped to npm start they should be interchangeable
# This is still a work in process Platform will not currently work run from npm/pnpm
platform start

# Build is the equivalent of npm run build
# Same as above will end up being interchangeable
platform build

# creates a favicon directory inside of the directory
# based off of the config passed in platform.config.json
platform faviconator
```

---

## Config Keys

| Key            | Default Value                                  | Description                                                                                                               |
|----------------|------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------|
| version        | 1.1                                            | The last changed version of the Platform config. Relates to the version in Platform the config changed                    |
| entries        | `object`                                       | Object of root entries for webpack to compile against. All entries should be relative to the directory Platform is run in |
| resolve        | `object`                                       | Object of key value pairs that define the location of a new root that Webpack should compile against (Parent Repo)        |
| externals		 | `object` { jsImportName : "{externalName}" }   |	Adds a hook to allow Webpack to use a library supplied by the browser 													  |
| inputFilePath  | "./src/"                                       | Tells webpack the main path to set context for all source files run in the project                                        |
| outputFilePath | "./dist/"                                      | Tells webpack the directory to place all distributable files                                                              |
| revisionAssets | false                                          | If set to true hash keys will be added to all js/css files for cache busting                                              |
| publicPath     | "/wp-content/themes/posturepress2-child/dist/" | The url path to get to compiled assets                                                                                    |
| port           | 10101                                          | The port that the dev server will run on. Can be changed in the unlikely scenario multiple instances need to be run       |
| faviconator    | `object`                                       | General config for the faviconator plugin in Platform                                                                     |

### Example Config:
```json
{
	"version": 1.1,
	"entries": {
		"app": ["./src/js/app.js", "./src/scss/app.scss"]
	},
	"resolve": {
		"Parent": "./../posturepress2/src/"
	},
	"inputFilePath": "./src/",
	"outputFilePath": "./dist/",
	"revisionAssets": false,
	"publicPath": "/wp-content/themes/posturepress2-child/dist/",
	"port": 10101,
	"faviconator": {
		"source": "./src/images/favicon.png",
		"appName": "Posturepress2",
		"appShortName": "PP2",
		"appDescription": "Posture Wordpress Theme",
		"developerName": "Posture",
		"developerURL": "https://getposture.com",
		"background": "#fff",
		"theme_color": "#fff"
	}
}
```

---

### Troubleshooting

### Issue:
```
Error:
Something went wrong installing the "sharp" module
```

Run:

`pnpm rebuild --verbose sharp`

---

### Issue: Files missing after adding to src while Platform is running

Sometimes after adding a file to `src`, especially nested images in new directories Webpack will not catch these new files.

**Solution:** Exit Platform and restart, the images should now be duplicated.

---

### Issue: Some files seem to not be placed where they existed in src or are not copied

Webpack for the most part will copy all images while matching directory structure, but for all other files scss/js/fonts etc... Follow the Webpack ideology of it must be included from src `scss/js` files.

---

### Issue: Compile times are taking 15+ seconds

**Solution:** Long compile times are usually caused by large image assets. Pre-emptively compressing images before adding to src should cut these times down.

---

### Issue: Odd rendering bugs while in dev mode

HMR has a small side effect of glitching out the browser after prolonged or rapid fire amounts of css reloads. In many cases if styles get wonky, before blaming the code reload the browser or run a `platform build` to check functionality.

---

### Issue: Running Platform on a pre-Platform/PP2 site

Platform was built to be an extensible fully featured compiler that should work in most circumstances. Moving an older site to Platform can be done in a few steps:

1. Run `platform start` in the theme directory
2. Open the `platform.config.json` that was placed in the directory by Platform
   - Important keys that will likely change:
     - `entries` - Modify the relative paths to match the src layout
     - `input/outputFilePaths` - Same here for any src layouts that are not just `./src/`
     - `publicPath` - Modify to point to the name of the theme (careful to include capitals!)
3. JS files should work out of the box for the most part. In scss files any direct imports must be changed to their `node_modules` counterpart
    - `_settings.scss`: `@import "util/util"` -> `@import "~foundation-sites/scss/util/util"`
    - `app.scss`: `@import "foundation"` -> `@import "~foundation-sites/scss/util/util"`
    - Do this for any direct imports that may be present. Platform will yell about them with helpful error logs.
4. Copy over the header/footer loader from PP2 and disable any existing enqueue scripts
5. For sites that use jQuery add this line to platform.config.json to use the WordPress jQuery library:
   - `externals: { jquery: "jQuery" }` - To note depending on the site the Q may or may not be capitalized in the quotes

**To note:** Although Platform may be functionally compatible with older sites, Platform compiles code in a different way then older systems. If a site explodes and the side effects are huge it's likely a sign of the existing code not playing well with the compiler. Best to leave the site on the existing system.

---

## Technology used in Platform

- [Webpack](https://webpack.js.org/) - The core bundler
- [Sass](https://sass-lang.com/) - JS compiled dart-sass
- [PostCSS](https://postcss.org/) - Transforms/auto-prefixes and minifies sass output
- [SWC](https://swc.rs/) - Replacement of Babel, simpler configs and faster!
- [Commander.js](https://github.com/tj/commander.js#readme) - Powers the CLI interface of Platform
