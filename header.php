<?php
/**
 * The template for displaying the header
 *
 * Displays all of the head element and everything up until the "container" div.
 *
 * @package PosturePress
 * @since PosturePress 1.0.0
 */

?>
<!doctype html>
<html class="no-js" <?php language_attributes(); ?> style="scroll-behavior: smooth">
	<head>
		<meta charset="<?php bloginfo( 'charset' ); ?>" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />


		<?php posture_favicons() ?>
		<?php wp_head(); ?>
		<?php PP2_header_loader(); ?>

	</head>
	<body <?php body_class(); ?>>

	<?php // enforces overflow-x on mobile and pushes the footer down if needed :) ?>
	<div class="body-controller">

<header class="site-header">
	<div class="f-grid">
		<div class="branding">
			<a class="home-link" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home">
				<img class="site-logo" src="<?php echo get_site_icon_url(100); ?>" alt="<?php bloginfo( 'name' ); ?>">
				<span class="site-title"><?php echo get_bloginfo( 'name' ); ?></span>
			</a>
		</div>
	</div>
</header>
