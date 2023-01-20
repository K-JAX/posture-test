<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the "off-canvas-wrap" div and all content after.
 *
 * @package PosturePress
 * @since PosturePress 1.0.0
 */
?>

<footer class="footer-container">
	<div class="footer-grid">
		<?php dynamic_sidebar( 'footer-widgets' ); ?>
	</div>
</footer>


<?php // closes the body controller ?>
</div>

<?php wp_footer(); ?>
<?php PP2_footer_loader(); ?>
</body>
</html>
