<?php

require_once plugin_dir_path( __FILE__ ) . 'gs-plugins-common-pages.php';

new GS_Plugins_Common_Pages([
	
	'parent_slug' 	   => 'youtube-gallery-settings',
	
	'lite_page_title' 	=> __('Lite Plugins by GS Plugins'),
	'pro_page_title' 	=> __('Premium Plugins by GS Plugins'),
	'help_page_title' 	=> __('Support & Documentation by Gs Plugins'),
	'lite_page_slug' 	=> 'gs-youtube-plugins-lite',
	'pro_page_slug' 	=> 'gs-youtube-plugins-premium',
	'help_page_slug' 	=> 'gs-youtube-plugins-help',

	'links' => [
		'docs_link' 	=> 'https://docs.gsplugins.com/gs-youtube-gallery/',
		'rating_link' 	=> 'https://wordpress.org/support/plugin/gs-youtube-gallery/reviews/',
	]

]);