/**
 * Main project app script!
 *
 * All script functionality should be in this file.
 *
 * NOTE: jQuery by default is NOT supported! Please make sure to follow ES6 paradigms and create vanilla JS
 * wherever possible. jQuery is included for the sake of plugins that we rely on such as Gravity Forms.
 * Refer to the document at https://wiki.posturedev.com for further information.
 **/

//Modules
// import { Glightbox, AOS, Swiper } from "Parent/js/modules/modules";

// All generic global site javascript should live in this file.
import Globals from "./globals";

// Attach the scripts after the website is up and running
document.addEventListener("DOMContentLoaded", () => {
	// Remove and uncomment the enqueue script in functions.php if not needed
	window.$ = jQuery();

	const globals = new Globals();
});
