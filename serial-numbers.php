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

define('cUKey','nV3lY5kI2jW5vK1cC8sH9mJ9jV5jU9fH');
define('cCRC','vY5{tQ2*iJ6%oA0}wP8&cX5%kF1>oQ2#');

define('cHASH1','eO3@uL8>oD6.aB2}lH3+rT5~rG2+mI5&');
define('cHASH2','cX3*sB0;yB6$lL4)zZ2;kK5&vX8>qQ9}');
define('cHASH3','wA7>rQ8#xC4)wX3.xD4(qI2$zL1%xK3_');
define('cHASH4','pO1$rA9)wS5(sG9%nY6>tZ1(iZ8~hC0{');
define('cHASH5','xU0:oF9%mG7.nZ2.pN2)tM3!iL3{hS7%');
define('cHASH6','jO4)zF2#uB2.sM8.uF2^dB1>oP0*zR6}');
define('cHASH7','kZ7^nD0{rN8}lL3,fI5)yT5.iP4%mE0$');
define('cHASH8','nJ5@lI0<nJ5""dD3{rS7:bU7,xS1~nF8!');
define('cHASH9','gQ0~iH5_rQ6}yK9+gA7}eM7!pH2_qH6,');
define('cHASH10','eE0!sW0.aA0(xG4#vQ1""qV6%kE1&rQ5}');

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
| Generator
|--------------------------------------------------------------------------
*/

function LSWGenerateKey($usagekey,$app,$version,$options,$name,$email,$address,$cell,$length,$padLength,$padChar)
{
    if ($usagekey == '')     return '1';
    if ($app == '')          return '2';
    if ($version == '')      return '3';
    if ($usagekey != cUKey)  return '4';
    $s = LSW_owh($usagekey . cCRC);
    $s .= strtolower($app);
    $s .= cHASH1;
    $s .= LSW_Clean($version);
    $s .= cHASH2;
    $s .= LSW_Clean($name);
    $s .= cHASH3;
    $s .= LSW_Clean($email);
    $s .= cHASH4;
    $s .= LSW_Clean($cell);
    $s .= cHASH5;
    $s .= LSW_Clean($options);
    $s .= cHASH6;
    return LSW_Pad(LSW_ToLength(LSW_ReplaceChars(LSW_owh($s)),$length),$padLength,$padChar);
}

function LSW_Pad($s,$every,$withChar)
{
    if($every <= 0 || $withChar == '') return $s;
    $v = '';
    $i = 0;
    $j = 0;
    $chars = str_split($s);
    foreach($chars as $c){
        $j++;
        $v .= $c;
        if($j >= strlen($s)) return $v;
        $i++;
        if($i == $every) {
            $i = 0;
            $v .= $withChar;

        }
    }
    return $v;
}

function LSW_ToLength($s,$length)
{
    if(strlen($s) > $length) {
        return substr($s,0,$length);
    }
    return $s;
}

function LSW_ReplaceChars($s)
{
    $s  = str_replace('0','S',$s);
    $s  = str_replace('O','2',$s);
    $s  = str_replace('I','J',$s);
    $s  = str_replace('1','5',$s);
    return $s;
}

function LSW_Clean($s)
{
    $strip = Array(" ",",",".","(",")","-","_");
    foreach($strip as $c) {
        $s = str_replace($c,'',$s);
    }

    for($i=0;$i<strlen($s);$i++) {
        $c = substr($s,$i,1);
        if(ord($c) < 32)
        {
            $s = str_replace($c,'',$s);
        }
    }

    return strtolower($s);
}

function LSW_owh($s)
{
    return strtoupper(md5($s));
}

function serial_numbers_generate_serial()
{
    return strtoupper(wp_generate_uuid4());
}

/*
|--------------------------------------------------------------------------
| REST routes
|--------------------------------------------------------------------------
*/

function serial_numbers_register_rest_routes()
{
    register_rest_route( SERIAL_NUMBERS_API_NAMESPACE, '/customers', array(
        'methods' => 'GET',
        'callback' => 'serial_numbers_fetch_customers',
        'permission_callback' => '__return_true',
    ) );

    register_rest_route( SERIAL_NUMBERS_API_NAMESPACE, '/generate', array(
        'methods' => 'POST',
        'callback' => 'serial_numbers_generate_serial_number',
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

function serial_numbers_fetch_customers( WP_REST_Request $request )
{
    $page = $request->get_param( 'page' );
    $limit = $request->get_param( 'limit' );

    $args = [
        'limit' => ( $limit === 'all' ) ? -1 : (int)$limit,
        'paged' => $page,
    ];

    $customers = get_users(array(
        'role' => 'customer',
        'number' => $limit
    ));

    $result = [];

    foreach ($customers as $customer) {

        $customer_id = $customer->ID;
        $customer_orders = wc_get_orders(array(
            'customer_id' => $customer_id,
            'limit' => -1,
        ));

        $orders_data = [];

        foreach ($customer_orders as $order) {
            $serial_number = get_post_meta($order->get_id(), '_serial_number', true);

            if (empty($serial_number)) {
                $serial_number = '';
                update_post_meta($order->get_id(), '_serial_number', $serial_number);
            }

            $orders_data[] = [
                'order_id' => $order->get_id(),
                'order_total' => $order->get_total(),
                'order_status' => $order->get_status(),
                'serial_number' => $serial_number
            ];
        }

        $result[] = [
            'id' => $customer_id,
            'fullName' => $customer->display_name,
            'email' => $customer->user_email,
            'orders' => $orders_data
        ];
    }

    return new WP_REST_Response( [
        'items' => $result,
        'total' => 40,
    ] );

}

function serial_numbers_generate_serial_number( WP_REST_Request $request )
{
    $order_data = $request->get_json_params();

    if (!isset($_POST['CRC'])) {
        echo 'EC_1';
        exit;
    }
    $checkCRC = $_POST['CRC'];
    $autoCRC = '';
    foreach ($_POST as $k => $v) {
        if ($k != 'CRC') {
            if ($autoCRC != '') $autoCRC .= '&';
            $autoCRC .= $k . '=' . rawurlencode($v);
        }
    }

    if ($checkCRC != LSW_owh($autoCRC . 'tQ3fY0aR0wV5nC3uL6iO9gV1tX5lM1rX')) {
        echo 'EC_2';
        exit;
    }

    if (!isset($_POST['Key'])) {
        echo 'EC_3';
        exit;
    }
    $key = $_POST['Key'];

    if (!isset($_POST['App'])) {
        echo 'EC_4';
        exit;
    }
    $app = $_POST['App'];

    if (!isset($_POST['Version'])) {
        echo 'EC_5';
        exit;
    }
    $version = $_POST['Version'];

    if (!isset($_POST['Action'])) {
        echo 'EC_6';
        exit;
    }
    $action = strtolower($_POST['Action']);

    $options = '0';

    if (isset($_POST['Options'])) $options = $_POST['Options'];

    $length = 24;
    if (isset($_POST['Length']) && is_numeric($_POST['Length']) && $_POST['Length'] >= 1 && $_POST['Length'] <= 100) $length = $_POST['Length'];

    $padLength = 4;
    if (isset($_POST['PadLength']) && is_numeric($_POST['PadLength']) && $_POST['PadLength'] >= 1 && $_POST['PadLength'] <= 100) $padLength = $_POST['PadLength'];

    $padChar = '-';
    if (isset($_POST['PadChar']) && strlen($_POST['PadChar'])) $padChar = $_POST['PadChar'];

    $name = '';
    $email = '';
    $address = '';
    $cell = '';
    if (isset($_POST['Name'])) {
        $name = $_POST['Name'];
    }
    if (isset($_POST['Address'])) {
        $address = $_POST['Address'];
    }
    if (isset($_POST['Email'])) {
        $email = $_POST['Email'];
    }
    if (isset($_POST['Cell'])) {
        $cell = $_POST['Cell'];
    }

    $serial_number = LSWGenerateKey(
        $key,
        $app,
        $version,
        $options,
        $name,
        $email,
        $address,
        $cell,
        $length,
        $padLength,
        $padChar
    );

    return WP_REST_Response( array(
        'serial_number' => $serial_number,
        'message' => 'Serial number generated successfully.',
    ) );
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

function serial_numbers_generate_for_order($order_id)
{
    if (!$order_id) {
        return;
    }
    $order = wc_get_order($order_id);
    $customer_id = $order->get_user_id();
    $serial_number = 'SN-' . strtoupper(uniqid());
    if ($customer_id) {
        update_user_meta($customer_id, '_serial_number', $serial_number);
    }
    update_post_meta($order_id, '_serial_number', $serial_number);
}

add_action('woocommerce_order_status_completed', 'serial_numbers_order_completion', 10, 1);

function serial_numbers_email_serial_number($order, $sent_to_admin, $plain_text)
{
    $serial_number = get_post_meta($order->get_id(), '_serial_number', true);
    if ($serial_number) {
        echo '<p><strong>Serial Number:</strong> ' . esc_html($serial_number) . '</p>';
    }
}

add_action('woocommerce_email_order_meta', 'serial_numbers_email_serial_number', 10, 3);

function serial_numbers_account_serial_number($order)
{
    $serial_number = get_post_meta($order->get_id(), 'serial_numbers_order', true);

    if ($serial_number) {

        $order_url = esc_url($order->get_view_order_url());
        $order_number = esc_html($order->get_order_number());

        echo '<h2>Order Serial Numbers</h2>';
        echo '<table class="woocommerce-table woocommerce-table--serial-numbers shop_table shop_table_responsive">';
        echo '<thead>';
        echo '<tr>';
        echo '<th>Order</th>';
        echo '<th>Serial Number</th>';
        echo '</tr>';
        echo '</thead>';
        echo '<tbody>';

        echo '<tr>';
        echo '<td><a href="' . $order_url . '">Order #' . $order_number . '</a></td>';
        echo '<td>' . esc_html($serial_number) . '</td>';
        echo '</tr>';

    }
}

add_action('woocommerce_order_details_after_order_table', 'serial_numbers_account_serial_number', 10, 1);

function serial_numbers_number_to_pdf_invoice($fields, $order) {

    $serial_number = get_post_meta($order->get_id(), '_serial_number', true);

    if ($serial_number) {
        $fields['serial_number'] = array(
            'label' => __('Serial Number', 'woocommerce'),
            'value' => $serial_number
        );
    }

    return $fields;
}

add_filter('wpo_wcpdf_custom_order_meta_data', 'serial_numbers_number_to_pdf_invoice', 10, 2);

/*
|--------------------------------------------------------------------------
| WP-CLI
|--------------------------------------------------------------------------
*/

if ( defined( 'WP_CLI' ) && WP_CLI ) {
    WP_CLI::add_command( 'wc-generate-product', 'WC_Product_Generator_Command' );
    WP_CLI::add_command( 'wc-generate-customers', 'WC_Customers_Generator_Command' );
    WP_CLI::add_command( 'wc-generate-orders', 'WC_Orders_Generator_Command' );
}

class WC_Product_Generator_Command {
    /**
     * Generate a downloadable WooCommerce product with variations.
     *
     * ## OPTIONS
     *
     * <product_name>
     * : The name of the product.
     *
     * ## EXAMPLES
     *
     *     wp wc-generate-product "My Awesome Product"
     *
     * @param array $args
     */
    public function __invoke( $args ) {
        $product_name = $args[0];

        if ( ! class_exists( 'WC_Product' ) ) {
            WP_CLI::error( 'WooCommerce is not installed or activated.' );
        }

        $product = new WC_Product_Variable();
        $product->set_name( $product_name );
        $product->set_status( 'publish' );
        $product->set_catalog_visibility( 'visible' );
        $product->set_description( 'This is a downloadable product with two variations: Pro and Studio.' );
        $product->set_sku( 'prod_' . wp_generate_uuid4() );
        $product->set_regular_price( '' );
        $product->set_downloadable( true );
        $product->save();

        $attribute = new WC_Product_Attribute();
        $attribute->set_name( 'Version' );
        $attribute->set_options( array( 'Pro', 'Studio' ) );
        $attribute->set_position( 0 );
        $attribute->set_visible( true );
        $attribute->set_variation( true );

        $product->set_attributes( array( $attribute ) );
        $product->save();

        $variation_pro = new WC_Product_Variation();
        $variation_pro->set_parent_id( $product->get_id() );
        $variation_pro->set_attributes( array( 'Version' => 'Pro' ) );
        $variation_pro->set_regular_price( '49.99' );
        $variation_pro->set_downloadable( true );
        $variation_pro->set_downloads( array( array(
            'name' => 'Pro Version',
            'file' => 'https://example.com/pro-download.zip'
        ) ) );
        $variation_pro->save();

        $variation_studio = new WC_Product_Variation();
        $variation_studio->set_parent_id( $product->get_id() );
        $variation_studio->set_attributes( array( 'Version' => 'Studio' ) );
        $variation_studio->set_regular_price( '99.99' );
        $variation_studio->set_downloadable( true );
        $variation_studio->set_downloads( array( array(
            'name' => 'Studio Version',
            'file' => 'https://example.com/studio-download.zip'
        ) ) );
        $variation_studio->save();

        WP_CLI::success( 'Product "' . $product_name . '" with Pro and Studio variations has been created.' );
    }
}
class WC_Customers_Generator_Command {
    /**
     * Generates one or more WooCommerce customers.
     *
     * ## OPTIONS
     *
     * <count>
     * : Number of customers to generate.
     *
     * [--email-domain=<domain>]
     * : Specify an email domain for generated customers (default: example.com).
     *
     * ## EXAMPLES
     *
     *     wp wc-generate-customers 5
     *     wp wc-generate-customers 3 --email-domain=mydomain.com
     *
     * @param array $args The arguments passed to the command.
     * @param array $assoc_args The associative arguments passed to the command.
     */
    public function __invoke( $args, $assoc_args ) {
        $count = isset( $args[0] ) ? intval( $args[0] ) : 1;
        $email_domain = isset( $assoc_args['email-domain'] ) ? sanitize_text_field( $assoc_args['email-domain'] ) : 'example.com';

        if ( ! function_exists( 'wc_create_new_customer' ) ) {
            WP_CLI::error( 'WooCommerce is not installed or activated.' );
        }

        for ( $i = 0; $i < $count; $i++ ) {

            $first_name = "Customer$i";
            $last_name = "Last$i";
            $email = "customer{$i}@$email_domain";
            $password = wp_generate_password( 12 );

            $user_id = wc_create_new_customer( $email, $email, $password, array(
                'first_name' => $first_name,
                'last_name'  => $last_name,
            ) );

            if ( is_wp_error( $user_id ) ) {
                WP_CLI::error( "Failed to create customer $i: " . $user_id->get_error_message() );
            } else {
                WP_CLI::log( "Customer $i created with email $email." );
            }

        }

        WP_CLI::success( "$count customers generated." );
    }
}
class WC_Orders_Generator_Command {
    /**
     * Generates one or more WooCommerce orders.
     *
     * ## OPTIONS
     *
     * [--count=<number>]
     * : Number of orders to generate. Default is 1.
     *
     * [--product_id=<product_id>]
     * : The ID of the downloadable product to create orders for.
     *
     * ## EXAMPLES
     *
     *     wp wc-generate-orders --count=10 --product_id=123
     *
     * @param array $args The arguments passed to the command.
     * @param array $assoc_args The associative arguments passed to the command.
     */
    public function __invoke( $args, $assoc_args ) {
        $count = isset($assoc_args['count']) ? intval($assoc_args['count']) : 1;
        $product_id = isset($assoc_args['product_id']) ? intval($assoc_args['product_id']) : null;

        if ( ! class_exists( 'WC_Order' ) ) {
            WP_CLI::error( 'WooCommerce is not installed or activated.' );
        }

        if (!$product_id || get_post_type($product_id) !== 'product') {
            WP_CLI::error('Please provide a valid product ID.');
            return;
        }

        for ($i = 0; $i < $count; $i++) {
            $order = wc_create_order();
            $product = wc_get_product($product_id);

            if (!$product) {
                WP_CLI::error('Invalid product ID: ' . $product_id);
                return;
            }

            if (!$product->is_downloadable()) {
                WP_CLI::error('Product is not downloadable.');
                return;
            }

            $order->add_product($product, 1); // Quantity 1
            $order->set_address(self::get_fake_address(), 'billing');
            $order->calculate_totals();
            $order->update_status('completed', 'Order generated via WP-CLI.');

            WP_CLI::success('Order #' . $order->get_id() . ' created.');
        }
    }

    /**
     * Returns a fake billing address.
     *
     * @return array
     */
    private static function get_fake_address() {
        return [
            'first_name' => 'John',
            'last_name'  => 'Doe',
            'company'    => '',
            'email'      => 'john.doe@example.com',
            'phone'      => '1234567890',
            'address_1'  => '123 Main St',
            'address_2'  => '',
            'city'       => 'Anytown',
            'state'      => 'CA',
            'postcode'   => '12345',
            'country'    => 'US',
        ];
    }
}
