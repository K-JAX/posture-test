import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import sortMediaQueries from "postcss-sort-media-queries";
const isProd = process.env.NODE_ENV === "production";
export default {
	plugins: [
		autoprefixer(),
		isProd ? cssnano() : "",
		sortMediaQueries({
			sort: "mobile-first",
		}),
	],
};
