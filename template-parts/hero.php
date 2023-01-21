<?php
/**
 * Template part for displaying the hero
 * 
 * @package PosturePress
 * @since PosturePress 1.0.0
 */

 if($args['hero']) :
	$hero = $args['hero'];
 endif;
?>

<div id="hero">
	<div class="video-embed-container">
		<iframe 
			class="video-embed" 
			src="https://www.youtube.com/embed/Sh0YoiVrvQ0?playlist=Sh0YoiVrvQ0&autoplay=1&mute=1&loop=1&modestbranding=1&controls=0" 
			title="YouTube video player" 
			frameborder="0" 
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen
			>
		</iframe>
	</div>
	<div class="hero-headline">
		<?php if($hero['headline']): ?>
			<h1 class="fluid-h1 mb-5"><?php echo $hero['headline']; ?></h1>
		<?php endif; ?>
		<?php if($hero['cta']['url'] && $hero['cta']['title']): 
			$target = $hero['cta']['target'] ? $hero['cta']['target'] : '_self';
			?>
			<a class="fancy-btn clear white" href="<?php echo esc_url($hero['cta']['url']); ?>" target="<?php echo esc_attr($target); ?>"><?php echo $hero['cta']['title']; ?></a>
		<?php endif ?>;
	</div>
</div>