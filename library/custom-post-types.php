<?php

/* Register Custom Post Types
/*
/* Replacements:
/*  <Capital Name> ex: "Practice Area"
/*  <Capital Name Plural> ex: "Practice Areas"
/*  <Slug> ex: "practice-areas"
/*  <Post Type Name> ex: "practice_areas"
/*  <Tax Type Lowercase> ex: "tag", "category"
/*  <Tax Type Uppercase> ex: "Tag", "category"
/*  <Tax Type Plural> ex: "tags", "categories"
*/

// function <Post Type Name>()
// {

//     $labels = array(
//         'name'                  => _x( '<Capital Name Plural>', '', 'text_domain' ),
//         'singular_name'         => _x( '<Capital Name>', '', 'text_domain' ),
//         'menu_name'             => __( '<Capital Name Plural>', 'text_domain' ),
//         'name_admin_bar'        => __( '<Capital Name Plural>', 'text_domain' ),
//         'archives'              => __( '<Capital Name Plural> Archives', 'text_domain' ),
//         'parent_item_colon'     => __( 'Parent <Capital Name Plural>:', 'text_domain' ),
//         'all_items'             => __( 'All <Capital Name Plural>', 'text_domain' ),
//         'add_new_item'          => __( 'Add New <Capital Name Plural>', 'text_domain' ),
//         'add_new'               => __( 'Add New', 'text_domain' ),
//         'new_item'              => __( 'New <Capital Name>', 'text_domain' ),
//         'edit_item'             => __( 'Edit <Capital Name Plural>', 'text_domain' ),
//         'update_item'           => __( 'Update <Capital Name>', 'text_domain' ),
//         'view_item'             => __( 'View <Capital Name>', 'text_domain' ),
//         'search_items'          => __( 'Search <Capital Name Plural>', 'text_domain' ),
//         'not_found'             => __( 'Not found', 'text_domain' ),
//         'not_found_in_trash'    => __( 'Not found in Trash', 'text_domain' ),
//         'featured_image'        => __( 'Featured Image', 'text_domain' ),
//         'set_featured_image'    => __( 'Set featured image', 'text_domain' ),
//         'remove_featured_image' => __( 'Remove featured image', 'text_domain' ),
//         'use_featured_image'    => __( 'Use as featured image', 'text_domain' ),
//         'insert_into_item'      => __( 'Insert into event', 'text_domain' ),
//         'uploaded_to_this_item' => __( 'Uploaded to this event', 'text_domain' ),
//         'items_list'            => __( '<Capital Name Plural> list', 'text_domain' ),
//         'items_list_navigation' => __( '<Capital Name Plural> list navigation', 'text_domain' ),
//         'filter_items_list'     => __( 'Filter events list', 'text_domain' ),
//     );

//     $args = array(
//         'label'                 => __( '<Capital Name Plural>', 'text_domain' ),
//         'labels'                => $labels,
//         'supports'              => array( 'title', 'thumbnail', 'editor' ),
//         'hierarchical'          => false,
//         'public'                => true,
//         'show_ui'               => true,
//         'show_in_menu'          => true,
//         'menu_position'         => 7,
//         'menu_icon'             => 'dashicons-portfolio',
//         'show_in_admin_bar'     => true,
//         'show_in_nav_menus'     => true,
//         'can_export'            => true,
//         'has_archive'           => true,
//         'exclude_from_search'   => false,
//         'publicly_queryable'    => true,
//         'capability_type'       => 'page',
//         'rewrite'               => array(
//                                         'slug'=>'<Slug>',
//                                         'with_front'=> true,
//                                         'feed'=> true,
//                                         'pages'=> true
//                                     ),
//     );
//     register_post_type( '<Post Type Name>', $args );

//     //Register custom taxonomy
//     // register_taxonomy(
//     //     '<Post Type Name>_<Tax Type Plural>',
//     //     array('<Post Type Name>'),
//     //     array(
//     //         'labels' => array(
//     //             'name' => '<Capital Name> <Tax Type Uppercase>s',
//     //             'add_new_item' => 'Add New <Capital Name> <Tax Type Uppercase>',
//     //             'new_item_name' => "New <Capital Name> <Tax Type Uppercase>"
//     //         ),
//     //         'rewrite' => array(
//     //             'slug'=>'<Slug>/<Tax Type Plural>',
//     //         ),
//     //         'show_ui' => true,
//     //         'show_tagcloud' => false,
//     //         'hierarchical' => true
//     //     )
//     // );

// }
// add_action( 'init', '<Post Type Name>', 0 );