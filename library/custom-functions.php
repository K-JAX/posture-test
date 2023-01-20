<?php

    /**
     * Add ACF Site Config Option
     *
     * @package PosturePress
     * @since PosturePress 1.0.0
     */
    if( function_exists('acf_add_options_page') ) {
        add_action('acf/init', 'my_acf_op_init');
        function my_acf_op_init() {

            // Check function exists.
            if( function_exists('acf_add_options_sub_page') ) {

                // Add parent.
                $parent = acf_add_options_page(array(
                    'page_title'  => __('Site Globals'),
                    'menu_title'  => __('Site Globals'),
                    'menu_slug'   => "site-globals",
                    'redirect'    => false,
                    'position' => '2.1',

                ));

                // Add sub page.
                // $child = acf_add_options_sub_page(array(
                //     'page_title'  => __('Contact & Social'),
                //     'menu_title'  => __('Contact & Social'),
                //     'parent_slug' => $parent['menu_slug'],
                // ));
            }
        }
    }