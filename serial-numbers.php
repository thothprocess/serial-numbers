<?php
/**
 * Plugin Name: Serial Numbers
 * Description: Manage serial numbers in an easy to use interface
 * Version: 0.1.0
 * Author: ThothProcess
 * Author URI: https://thothprocess.com
 */

if (!defined('ABSPATH')) {
    exit();
}

/*
|--------------------------------------------------------------------------
| Autloader
|--------------------------------------------------------------------------
*/

require_once __DIR__ . '/vendor/autoload.php';

/*
|--------------------------------------------------------------------------
| Settings
|--------------------------------------------------------------------------
*/

function serial_numbers_register_setting()
{
    register_setting( 'serial_numbers_settings_group', 'serial_numbers_use_external_api' );
}

add_action('admin_init', 'serial_numbers_register_setting');

/*
|--------------------------------------------------------------------------
| Admin pages
|--------------------------------------------------------------------------
*/

function serial_numbers_register_admin_pages()
{
    add_menu_page(
        'Serial Numbers',                       // Page title
        'Serial Numbers',                       // Menu title
        'manage_options',                       // Capability required
        'serial-numbers',                       // Menu slug
        'serial_numbers_render_admin_page',     // Callback function
        'dashicons-lock',                       // Icon URL
        2                                       // Menu position
    );

    add_submenu_page(
        'serial-numbers',                       // Parent slug
        'Settings',                             // Page title
        'Settings',                             // Menu title
        'manage_options',                       // Capability
        'wp-boilerplate-settings',              // Menu slug
        'serial_numbers_render_settings_page'   // Callback function
    );
}

function serial_numbers_render_admin_page()
{
    ?>
        <div class="wrap">
            <div id="root"></div>
        </div>
    <?php
}

function serial_numbers_render_settings_page()
{
    $plugin_data = get_plugin_data( __FILE__ );
    $version = $plugin_data['Version'];
    $changelog_url = 'https://github.com/thothprocess/serial-numbers/releases';
    $current_setting = get_option( 'serial_numbers_use_api_type', 'internal' );

    ?>
    <div class="wrap">
        <h1><?php esc_html_e( 'Settings', 'sng' ); ?></h1>
        <p>
            <strong>Current Version:</strong>
            <code><?php echo esc_html( $version ); ?></code>
            <a href="<?php echo esc_url( $changelog_url ) ?>" target="_blank">Whats New?</a>
        </p>
        <p>
            <?php settings_fields( 'serial_numbers_settings_group' ); ?>
            <?php do_settings_sections( 'serial_numbers_settings_group' ); ?>
            <div><strong><?php esc_html_e( 'Select API type', 'sng' ); ?>:</strong></div>
            <div class="sng-radio-group" style="padding: 20px; border: 1px solid; margin-top: 4px;">
                <label class="sng-radio-label">
                    <input
                        type="radio"
                        name="serial_numbers_use_api_type"
                        value="internal" <?php checked( 'internal', $current_setting ); ?>>
                    <span class="sng-radio-button">
                        <?php esc_html_e( 'Use Internal API', 'sng' ); ?>
                    </span>
                </label>
            </div>
            <div class="sng-radio-group" style="padding: 20px; border: 1px solid; margin-top: 4px;">
                <label class="sng-radio-label">
                    <input
                        type="radio"
                        name="serial_numbers_use_api_type"
                        value="external" <?php checked( 'external', $current_setting ); ?>>
                    <span class="sng-radio-button">
                        <?php esc_html_e( 'Use External API', 'sng' ); ?>
                    </span>
                </label>
            </div>
            <?php submit_button(); ?>
        </p>
    </div>
    <?php
}

add_action( 'admin_menu', 'serial_numbers_register_admin_pages' );

/*
|--------------------------------------------------------------------------
|--------------------------------------------------------------------------
*/

function serial_numbers_enqueue_script( $hook_suffix )
{
    $allowed_pages = [ 'serial-numbers' ];
    $current_page_slug = str_replace( 'toplevel_page_', '', $hook_suffix );
    if ( in_array( $current_page_slug, $allowed_pages ) ) {
        \Kucrut\Vite\enqueue_asset(
            plugin_dir_path( __FILE__ ) . '/dist',
            'src/main.tsx',
            [
                'dependencies' => [ 'react', 'react-dom' ],
                'handle'       => 'serial-numbers',
                'in-footer'    => true,
            ]
        );
    }
}

add_action( 'admin_enqueue_scripts', 'serial_numbers_enqueue_script' );

/*
|--------------------------------------------------------------------------
| REST routes
|--------------------------------------------------------------------------
*/
