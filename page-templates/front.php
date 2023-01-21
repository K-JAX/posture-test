<?php
/*
Template Name: Front
*/
get_header(); ?>

<main>
	<?php /* section 1 hero */ ?>
	<?php 
		$hero = get_field('hero_section');
		if ($hero):
			get_template_part('template-parts/hero', null, array('hero' => $hero)); 
		endif;
	?>
	<?php /* section 2 introduction */ ?>
	<?php 
		$introduction = get_field('introduction_section');
		if ($introduction):
	?>
		<section id="introduction" class="container mb-8">
			<div class="flex content overlay overlay--previous p-5">
				<div class="cell caption" >
					<?php if($introduction['title']): ?>
						<h2 class="mb-5"><?php echo $introduction['title']; ?></h2>
					<?php endif; ?>
					<?php if($introduction['description']): ?>
						<div class="description">
							<?php echo $introduction['description']; ?>
						</div>
					<?php endif; ?>
					<?php if($introduction['cta']): 
						$target = $introduction['cta']['target'] ? $introduction['cta']['target'] : '_self';
						?>
						<a class="fancy-btn secondary" href="<?php echo $introduction['cta']['url']; ?>" target="<?php echo $$target; ?>"><?php echo $introduction['cta']['title']; ?></a>
					<?php endif; ?>
				</div>
				<div class="cell image" >
					<?php if($introduction['image']): ?>
						<img src="<?php echo $introduction['image']['url']; ?>" alt="<?php echo $introduction['image']['alt']; ?>">
					<?php endif; ?>
				</div>
			</div>
		</section>
	<?php endif; ?>
	
	<?php /* section 3 why */ ?>
	<?php 
		$why = get_field('why_section');
		if ($why):
	?>
		<section id="why" class="bg-primary text-white my-5 py-8">
			<div class="container">
				<div class="f-grid-halves content">
					<div class="cell">
						<?php if($why['title']): ?>
							<h2><?php echo $why['title']; ?></h2>
						<?php endif; ?>
						<?php if($why['description']): ?>
							<div class="description">
								<?php echo $why['description']; ?>
							</div>
						<?php endif; ?>
						<?php if($why['cta']): 
							$target = $why['cta']['target'] ? $why['cta']['target'] : '_self';
							?>
							<a class="fancy-btn clear white" href="<?php echo $why['cta']['url']; ?>" target="<?php echo $$target; ?>"><?php echo $why['cta']['title']; ?></a>
						<?php endif; ?>
					</div>
					<div class="cell image mt-n5">
						<?php if($why['image']): ?>
							<img src="<?php echo $why['image']['url']; ?>" alt="<?php echo $why['image']['alt']; ?>">
						<?php endif; ?>
					</div>
				</div>
			</div>
		</section>
	<?php endif; ?>
	
	<?php /* section 4 blog posts */ ?>
	<?php 
		$news = get_field('news_section');
		if( $news ): 
	?>
		<section id="news" class="container py-8">
			<h2 class="text-center my-6"><?php echo $news['title']; ?></h2>
			<?php echo $news['posts_shortcode']; ?>
			<div class="flex justify-content-center my-5">
				<?php if ($news['cta']) : ?>
					<a href="<?php echo $news['cta']['url']; ?>" class="modern-art-btn"><span><?php echo $news['cta']['title']; ?></span></a>
				<?php endif; ?>
			</div>
		</section>
	<?php endif; ?>
</main>

<?php get_footer();
