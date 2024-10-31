<?php
/**
 * @package seologies
 * @version 1.0
 */
/*
Plugin Name: Seologies
Plugin URI: http://www.seologies.com/
Description: This is integration with www.seologies.com plugin.
Author: www.seologies.com
Version: 1.0
Author URI: http://www.seologies.com/


Release Notes:

1.0 - Initial release
*/

if (!function_exists('add_filter')) {
	header('Status: 403 Forbidden');
	header('HTTP/1.1 403 Forbidden');
	exit();
}
 

define('SEOLOGIES_API_URL', 'https://www.seologies.com/app/wordpress/');
define('SEOLOGIES_PATH', dirname(__FILE__).'/');
define('SEOLOGIES_VERSION', '1.0');
define('SEOLOGIES_APP_PREFIX', 'wp_seologies_');


function seologies_logit($txt, $fname = 'logit_blog', $trace = false) {
	if (! is_string($txt)) {
		$txt = var_export($txt, true);
	}
	$ex = '';
	if ($trace) {
		$ex = new Exception();
		$ex = "\r\n" . $ex->getTraceAsString();
	}
	
	if (empty($fname)) {
		$fname = 'logit';
	}
	file_put_contents(wp_upload_dir() . '/' . $fname . '.log', "\r\n" . gmdate('Y-m-d H:i:s') . ' ' . $_SERVER['REMOTE_ADDR'] . ' ' . $txt . $ex . "\r\n", FILE_APPEND);
}

   

//=================================================================
// API calls related functions
//=================================================================

function seologies_check_apikey($apikey) {
	$response = wp_remote_post(SEOLOGIES_API_URL . 'checkapikey', array(
			'body' => array(
					'apikey' => $apikey,
					'version' => SEOLOGIES_VERSION
			)
	));
	
	if (is_wp_error($response) || (200 != wp_remote_retrieve_response_code($response))) {
		return false;
	}
	
	$result = json_decode(wp_remote_retrieve_body($response), true);
	
	if (! is_array($result) || ($result['status'] != 'ok')) {
		return false;
	}
	
	return $result['data'];
}
 

function seologies_ajax_dologin() {
	$data = $_POST;
	$data = array_map('stripslashes_deep', $data);
	$data['version'] = SEOLOGIES_VERSION;
	
	$response = wp_remote_post(SEOLOGIES_API_URL . 'authenticate', array(
			'body' => $data
	));
	
	wp_send_json(seologies_process_login($response));
	
	wp_die();
}


function seologies_ajax_doregister() {
	$data = $_POST;
	$data = array_map('stripslashes_deep', $data);
	$data['version'] = SEOLOGIES_VERSION;
	
	$response = wp_remote_post(SEOLOGIES_API_URL . 'register', array(
			'body' => $data
	));
	
	wp_send_json(seologies_process_login($response));
	
	wp_die();
}

function seologies_process_login($response) {
	$result = array();
	
	if (is_wp_error($response) || (200 != wp_remote_retrieve_response_code($response))) {
		$result = array(
				'status' => 'error',
				'error' => __('Can not connect to www.seologies.com server.')
		);
	} else {
		$result = json_decode(wp_remote_retrieve_body($response), true);
		
		if ($result['status'] == 'ok') {
			global $current_user;
			if ($current_user->ID > 0) {
				$option_name = SEOLOGIES_APP_PREFIX . $current_user->ID;
				
				setcookie($option_name, base64_encode(json_encode($result['data'])), 0, '/');
				
				if (get_option($option_name) !== false) {
					update_option($option_name, $result['data']['apikey']);
				} else {
					$deprecated = null;
					$autoload = 'no';
					add_option($option_name, $result['data']['apikey'], $deprecated, $autoload);
				}
			} else {
				$result = array(
						'status' => 'error',
						'error' => __('You must be logged in into wordpress to use seologies plugin.')
				);
			}
		}
	}
	
	return $result;
}
 

function seologies_ajax_dologout() {
	global $current_user;
	$result = array(
			'status' => 'ok'
	);
	
	if ($current_user->ID > 0) {
		$option_name = SEOLOGIES_APP_PREFIX . $current_user->ID;
		
		setcookie($option_name, - 1, time() + 24 * 365 * 3600, '/');
		update_option($option_name, '');
	} else {
		$result = array(
				'status' => 'error',
				'error' => __('You must be logged in into wordpress to use seologies plugin.')
		);
	}
	
	wp_send_json($result);
	
	wp_die();
}

function seologies_ajax_dorelevantwordscompare() {
	return seologies_ajax_doseotool('relevantwordscompare');
}

function seologies_ajax_dorelevantwords() {
	return seologies_ajax_doseotool('relevantwords');
}

function seologies_ajax_doseotool($seotool) {
	global $current_user;
	$result = array(
			'status' => 'ok'
	);
	
	if ($current_user->ID > 0) {
		$option_name = SEOLOGIES_APP_PREFIX . $current_user->ID;
		
		if (isset($_COOKIE[$option_name]) && ($_COOKIE[$option_name] != - 1)) {
			$user_info = base64_decode($_COOKIE[$option_name]);
			$user_info = json_decode($user_info, true);
			
			$data = $_POST;
			$data = array_map('stripslashes_deep', $data);
			$data['version'] = SEOLOGIES_VERSION;
			$data['apikey'] = $user_info['apikey'];
			
			if (! empty($data['apikey'])) {
				$response = wp_remote_post(SEOLOGIES_API_URL . $seotool, array(
						'body' => $data
				));
				
				// seologies_logit($_POST);
				// seologies_logit($response);
				
				if (is_wp_error($response) || (200 != wp_remote_retrieve_response_code($response))) {
					$result = array(
							'status' => 'error',
							'error' => __('Can not connect to www.seologies.com server.')
					);
				} else {
					$result = json_decode(wp_remote_retrieve_body($response), true);
					
					if (($result['status'] == 'ok') && ! empty($result['page'])) {
						$response = wp_remote_get(SEOLOGIES_API_URL . '../../content/' . $result['page']);
						$result['page'] = wp_remote_retrieve_body($response);
					}
				}
			} else {
				$result = array(
						'status' => 'error',
						'error' => __('You must be logged in into seologies to use seologies plugin.')
				);
			}
		} else {
			$result = array(
					'status' => 'error',
					'error' => __('You must be logged in into seologies to use seologies plugin.')
			);
		}
	} else {
		$result = array(
				'status' => 'error',
				'error' => __('You must be logged in into wordpress to use seologies plugin.')
		);
	}
	
	wp_send_json($result);
	
	wp_die();
}

//=================================================================
// bussiness logic related functions
//=================================================================
  

function seologies_init() {
	// check login information
	$loggedin = false;
	$apikey = $script = '';
	
	global $current_user;
	
	if ($current_user->ID > 0) {
		$option_name = SEOLOGIES_APP_PREFIX . $current_user->ID;
		
		if (isset($_COOKIE[$option_name]) && ($_COOKIE[$option_name] != - 1)) {
			$loggedin = true;
			
			$user_info = json_decode(base64_decode($_COOKIE[$option_name]), true);
		} elseif (! isset($_COOKIE[$option_name]) || ($_COOKIE[$option_name] == - 1)) {
			// check login info in DB
			$apikey = get_option($option_name);
			
			if (! empty($apikey)) {
				$user_info = seologies_check_apikey($apikey);
				if ($user_info) {
					$script = "jQuery(document).ready(function(){seologiesSetCookie('$option_name', '" . base64_encode(json_encode($user_info)) . "');})";
					// wp_setcookie($option_name, $apikey, time() + 24*365*3600, '/');
					$loggedin = true;
				} else {
					update_option($option_name, '');
				}
			}
		}
	}
	
	return array(
			'script' => $script,
			'loggedin' => $loggedin,
			'user_info' => $user_info
	);
}



//=================================================================
// display related functions
//=================================================================

function seologies_plugin_enqueue() {
	global $pagenow;
	
	if (! in_array($pagenow, array(
			'post-new.php',
			'post.php',
			'edit.php'
	), true)) {
		return;
	}
	
	wp_enqueue_style('seologies', plugins_url('css/seologies.css', __FILE__), array(), SEOLOGIES_VERSION);
	
	wp_enqueue_script('seologies', plugins_url('js/seologies.js', __FILE__), array(), SEOLOGIES_VERSION, true);
	wp_enqueue_script('seologies-relevantwords', plugins_url('js/relevantwords.js', __FILE__), array(), SEOLOGIES_VERSION, true);
	wp_enqueue_script('seologies-relevantwordscompare', plugins_url('js/relevantwordscompare.js', __FILE__), array(), SEOLOGIES_VERSION, true);
	wp_enqueue_script('seologies-smart', plugins_url('js/smart-2.9.min.js', __FILE__), array(), SEOLOGIES_VERSION, true);
	wp_enqueue_script('seologies-functions', plugins_url('js/functions.js', __FILE__), array(), SEOLOGIES_VERSION, true);
}
 

function seologies_plugin_html() {
	global $current_user;
	
	$seologies_info = seologies_init();
	
	require_once SEOLOGIES_PATH . '/pages/header.phtml';
	
	require_once SEOLOGIES_PATH . '/pages/login.phtml';
	require_once SEOLOGIES_PATH . '/pages/register.phtml';
	require_once SEOLOGIES_PATH . '/pages/expert_vocabulary.phtml';
	require_once SEOLOGIES_PATH . '/pages/audit_text.phtml';
	
	require_once SEOLOGIES_PATH . '/pages/footer.phtml';
}


//=================================================================
// Wordpress actions related functions
//=================================================================


add_action('wp_ajax_seologies_dologin', 'seologies_ajax_dologin');
add_action('wp_ajax_seologies_doregister', 'seologies_ajax_doregister');
add_action('wp_ajax_seologies_dologout', 'seologies_ajax_dologout');
add_action('wp_ajax_seologies_dorelevantwords', 'seologies_ajax_dorelevantwords');
add_action('wp_ajax_seologies_dorelevantwordscompare', 'seologies_ajax_dorelevantwordscompare');

add_filter('http_request_timeout', 'seologies_http_request_timeout');

function seologies_http_request_timeout() {
	return 30;
}

function seologies_add_meta_box() {
	$post_types =  array('post', 'page');

	foreach ($post_types as  $key =>  $post_type) {
		add_meta_box( 'seologies_meta', __('Seologies'), 'seologies_plugin_html', $post_type, 'normal');
	}
}

add_action('add_meta_boxes',  'seologies_add_meta_box');
add_action('admin_enqueue_scripts', 'seologies_plugin_enqueue');	
 
?>