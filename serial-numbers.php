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
| Constants
|--------------------------------------------------------------------------
*/

define( 'SERIAL_NUMBERS_API_NAMESPACE', 'serial-numbers/v1' );

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

function serial_numbers_register_settings()
{
    register_setting( 'serial_numbers_settings_group', 'use_external_api', [
        'type' => 'boolean',
        'default' => true,
    ] );
}

add_action( 'admin_init', 'serial_numbers_register_settings' );

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

    ?>
    <div class="wrap">
        <h1><?php esc_html_e( 'Settings', 'serial-numbers' ); ?></h1>
        <form method="post" action="options.php">
            <p>
                <strong>Current Version:</strong>
                <code><?php echo esc_html( $version ); ?></code>
                <a href="<?php echo esc_url( $changelog_url ) ?>" target="_blank">Whats New?</a>
            </p>
            <p>
                <?php
                settings_fields( 'serial_numbers_settings_group' );
                do_settings_sections( 'serial_numbers_settings_group' );
                ?>
                <div><strong><?php esc_html_e( 'Select API type', 'serial-numbers' ); ?>:</strong></div>
                <div class="sng-radio-group" style="padding: 20px; border: 1px solid; margin-top: 4px;">
                    <label class="sng-radio-label">
                        <input
                            type="radio"
                            name="use_external_api"
                            value="1" <?php checked( 'use_external_api', get_option( 'use_external_api' ) ); ?>>
                        <span class="sng-radio-button">
                            <?php esc_html_e( 'Use External API', 'serial-numbers' ); ?>
                        </span>
                    </label>
                </div>
                <div class="sng-radio-group" style="padding: 20px; border: 1px solid; margin-top: 4px;">
                    <label class="sng-radio-label">
                        <input
                            type="radio"
                            name="use_external_api"
                            value="0" <?php checked( 'use_external_api', get_option( 'use_external_api' ) ); ?>>
                        <span class="sng-radio-button">
                            <?php esc_html_e( 'Use Internal API', 'serial-numbers' ); ?>
                        </span>
                    </label>
                </div>
                <?php submit_button(); ?>
            </p>
        </form>
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

function serial_numbers_register_rest_routes()
{
    register_rest_route( SERIAL_NUMBERS_API_NAMESPACE, '/generate', array(
        'methods' => 'POST',
        'callback' => 'serial_numbers_generate_serial_number',
        'permission_callback' => '__return_true',
    ) );

    register_rest_route( SERIAL_NUMBERS_API_NAMESPACE, '/customers', array(
        'methods' => 'GET',
        'callback' => 'serial_numbers_fetch_customers',
        'args' => [
            'page' => [
                'required' => false,
                'validate_callback' => 'is_numeric',
                'default' => 1,
            ],
            'limit' => [
                'required' => false,
                'validate_callback' => 'validate_limit',
                'default' => 10,
            ],
        ],
        'permission_callback' => '__return_true',
    ) );

    register_rest_route( SERIAL_NUMBERS_API_NAMESPACE, '/register', array(
        'methods'  => 'POST',
        'callback' => 'serial_numbers_register_customer',
        'permission_callback' => '__return_true',
    ) );

    register_rest_route( SERIAL_NUMBERS_API_NAMESPACE, '/validate', array(
        'methods' => 'POST',
        'callback' => 'serial_numbers_validate_serial_number',
        'permission_callback' => '__return_true',
    ) );
}

function validate_limit( $param )
{
    $allowed_limits = [ 10, 20, 50, 100, 'all' ];
    return in_array( $param, $allowed_limits );
}

function serial_numbers_generate_serial_number( WP_REST_Request $request )
{
    $order_data = $request->get_json_params();
    if ( empty( $order_data['name'] ) || empty( $order_data['email'] ) || empty( $order_data['product_id'] ) ) {
        return new WP_Error( 'missing_data', 'Missing required customer data', array( 'status' => 400 ) );
    }
    $serial_number = strtoupper( uniqid( "SN-" ) );

    return rest_ensure_response( array(
        'serial_number' => $serial_number,
        'message' => 'Serial number generated successfully.',
    ) );
}

function serial_numbers_fetch_customers( WP_REST_Request $request )
{
    $page = $request->get_param( 'page' );
    $limit = $request->get_param( 'limit' );
    $args = [
        'limit' => ( $limit === 'all' ) ? -1 : (int)$limit,
        'paged' => $page,
    ];

    $query = new WC_Customer_Query( $args );
    $customers = $query->get_customers();
    $total_customers = $query->get_total();
    $total_pages = $limit === 'all' ? 1 : ceil( $total_customers / $limit );

    return new WP_REST_Response( [
        'customers' => $customers,
        'pagination' => [
            'total_customers' => $total_customers,
            'total_pages' => $total_pages,
            'current_page' => $page,
            'limit' => $limit,
        ],
    ] );
}

function wp_boilerplate_create_customer( WP_REST_Request $request )
{
    $required_fields = [ 'first_name', 'last_name', 'email', 'billing_address', 'shipping_address', 'phone' ];
    foreach ( $required_fields as $field ) {
        if ( empty( $request->get_param( $field ) ) ) {
            return new WP_REST_Response( [ 'error' => 'Missing field: ' . $field ], 400 );
        }
    }
    $email = sanitize_email( $request->get_param( 'email' ) );

    if ( email_exists( $email ) ) {
        return new WP_REST_Response( [ 'error' => 'Customer already exists' ], 409 );
    }

    $customer = new WC_Customer();
    $customer->set_first_name( sanitize_text_field( $request->get_param('first_name' ) ) );
    $customer->set_last_name( sanitize_text_field( $request->get_param('last_name' ) ) );
    $customer->set_email( $email );
    $customer->set_billing_address( $request->get_param( 'billing_address' ) );
    $customer->set_shipping_address( $request->get_param( 'shipping_address' ) );
    $customer->set_billing_phone( sanitize_text_field( $request->get_param('phone' ) ) );

    $customer_id = $customer->save();

    if ( is_wp_error( $customer_id ) ) {
        return new WP_REST_Response( [ 'error' => 'Unable to create customer' ], 500 );
    }

    $serial_number = wp_generate_uuid4();
    update_user_meta( $customer_id, '_customer_serial_number', $serial_number );

    return new WP_REST_Response( [
        'customer_id' => $customer_id,
        'serial_number' => $serial_number
    ], 201 );
}

function serial_numbers_validate_serial_number( WP_REST_Request $request )
{
    return new WP_REST_Response( [], 200 );
}

add_action( 'rest_api_init', 'serial_numbers_register_rest_routes' );

/*
|--------------------------------------------------------------------------
| WooCommerce
|--------------------------------------------------------------------------
*/
