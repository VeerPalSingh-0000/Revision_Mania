<?php
/**
 *
 * @package   GS Videos for YouTube
 * @author    GS Plugins <hello@gsplugins.com>
 * @license   GPL-2.0+
 * @link      https://www.gsplugins.com
 * @copyright 2016 GS Plugins
 *
 * @wordpress-plugin
 * Plugin Name:           GS Videos for YouTube
 * Plugin URI:            https://www.gsplugins.com/wordpress-plugins
 * Description:           Best Responsive YouTube Gallery plugin for WordPress to display YouTube Channel or Playlist videos on your site. Display anywhere on your site using shortcodes like [gs_ytgal theme="gs_ytgal_grid"] & Widgets. Check more shortcode examples on <a href="https://youtubegallery.gsplugins.com">GS Youtube Galler Demo</a> and <a href="https://docs.gsplugins.com/gs-youtube-gallery">Documentation</a>.
 * Version:               1.2.1
 * Author:                GS Plugins
 * Author URI:            https://www.gsplugins.com
 * Text Domain:           gsyoutubegalleries
 * License:               GPL-2.0+
 * License URI:           http://www.gnu.org/licenses/gpl-2.0.txt
 */

if( ! defined( 'GSYOUTUBEGALLERIES_HACK_MSG' ) ) define( 'GSYOUTUBEGALLERIES_HACK_MSG', __( 'Sorry cowboy! This is not your place', 'gsyoutubegallery' ) );

/**
 * Protect direct access
 */
if ( ! defined( 'ABSPATH' ) ) die( GSYOUTUBEGALLERIES_HACK_MSG );

/**
 * Defining constants
*/
if( ! defined( 'GSYOUTUBEGALLERIES_VERSION' ) ) define( 'GSYOUTUBEGALLERIES_VERSION', '1.2.1' );
if( ! defined( 'GSYOUTUBEGALLERIES_MENU_POSITION' ) ) define( 'GSYOUTUBEGALLERIES_MENU_POSITION', '31' );
if( ! defined( 'GSYOUTUBEGALLERIES_PLUGIN_DIR' ) ) define( 'GSYOUTUBEGALLERIES_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
if( ! defined( 'GSYOUTUBEGALLERIES_PLUGIN_URI' ) ) define( 'GSYOUTUBEGALLERIES_PLUGIN_URI', plugins_url( '', __FILE__ ) );
if( ! defined( 'GSYOUTUBEGALLERIES_FILES_DIR' ) ) define( 'GSYOUTUBEGALLERIES_FILES_DIR', GSYOUTUBEGALLERIES_PLUGIN_DIR . 'gs-youtubegalleries-files' );
if( ! defined( 'GSYOUTUBEGALLERIES_FILES_URI' ) ) define( 'GSYOUTUBEGALLERIES_FILES_URI', GSYOUTUBEGALLERIES_PLUGIN_URI . '/gs-youtubegalleries-files' );

/**
 * Initialize the plugin tracker
 *
 * @return void
 */
function appsero_init_tracker_gs_youtube_gallery() {

    if ( ! class_exists( 'GSYoutubeAppSero\Client' ) ) {
      require_once __DIR__ . '/appsero/Client.php';
    }

    $client = new GSYoutubeAppSero\Client( '48983c18-00ca-4a7a-b9d4-d1a36cf745eb', 'GS Videos for YouTube', __FILE__ );

    // Active insights
    $client->insights()->init();

}

appsero_init_tracker_gs_youtube_gallery();

function disable_youtube_lite() {
	if ( is_plugin_active( 'gs-youtube-gallery-pro/gs_youtubegalleries.php' ) ) {
		deactivate_plugins( 'gs-youtube-gallery-pro/gs_youtubegalleries.php', true );
	}
  add_option('gs_youtube_activation_redirect', true);
}

register_activation_hook( __FILE__, 'disable_youtube_lite' );

add_action( 'plugins_loaded', function() {
    require_once GSYOUTUBEGALLERIES_FILES_DIR . '/includes/gs-youtube-root.php';
}, -999999 );

