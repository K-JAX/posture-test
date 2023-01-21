<?php
/**
 * tweaking the favicon function to check file exists first
 */

	function posture_favicons_tweak() {

		$sizes = array(
			'57x57',
			'114x114',
			'72x72',
			'144x144',
			'60x60',
			'120x120',
			'76x76',
			'152x152',
			'196x196',
			'96x96',
			'32x32',
			'16x16',
			'128x128'
		);

		$ms_sizes = array(
			'144x144',
			'70x70',
			'150x150',
			'310x150',
			'310x310'
		);

		// link tags
		foreach ( $sizes as $size ) {
			$size = explode( 'x', $size );
			$size = $size[0];
			$isSiteIcon = $size == 196 || $size == 96 || $size == 32 || $size == 16 || $size == 128;
			$rel = ( $isSiteIcon ) ? 'icon' : 'apple-touch-icon-precomposed';
			$type = ( $isSiteIcon ) ? 'image/png' : 'image/x-icon';
			$filename = 'apple-touch-icon-' . $size . 'x' . $size . '.png';
			if ( file_exists( get_stylesheet_directory() . '/favicons/' . $filename ) ) {
				echo '<link rel="' . $rel . '" type="'. $type .'" sizes="' . $size . 'x' . $size . '" href="' . childURL() . '/favicons/' . $filename . '" />';
			}
		}

		// meta tags
		foreach ( $ms_sizes as $size ) {
			$filename = 'mstile-' . $size . '.png';
			if ( file_exists( get_stylesheet_directory() . '/favicons/' . $filename ) ) {
				echo '<meta name="msapplication-TileImage" content="' . childURL() . '/favicons/' . $filename . '" />';
			}
		}

	}
