<?php
/*
Template Name: Front
*/
get_header(); ?>

<?php /* section 1 hero */ ?>

<?php get_template_part('template-parts/hero'); ?>

<?php /* section 2 introduction */ ?>

<?php /* section 3 why */ ?>

<?php /* section 4 blog posts */ ?>
<section class="container">
	<h2 style="text-align: center;">News &amp; Updates</h2>
	<div class="f-grid">
	<?php 
	/* get the latest 3 posts */
	$latest_posts = new WP_Query( array(
		'posts_per_page' => 3,
		'post_type' => 'post',
		'post_status' => 'publish',
		'orderby' => 'date',
		'order' => 'DESC',
	) ); ?>
	<?php if ( $latest_posts->have_posts() ) : ?>
		<?php while ( $latest_posts->have_posts() ) : $latest_posts->the_post(); ?>
			<div class="card cell">
				<a href="<?php the_permalink(); ?>">
					<figure>
					<?php the_post_thumbnail(); ?>
					<figcaption>
						<h3 class="card-title"><?php the_title(); ?></h3>
						<p class="card-excerpt"><?php the_excerpt(); ?></p>
					</figcaption>
					</figure>
				</a>
			</div>
		<?php endwhile; ?>
	<?php endif; ?>
	</div>
</section>

<?php get_footer();
