<?php

declare(strict_types=1);

/**
 * Kiểm tra lớp Meta (user meta + post meta) và việc đọc bài viết.
 *
 * Endpoint cart trước đây fail 500 vì thiếu get_user_meta(); chỉ chạy lại
 * endpoint thì không đủ – hàm có thể "không lỗi" mà vẫn trả sai. Test này gắn
 * đúng ngữ nghĩa của core: $single, serialize mảng, update ghi đè dòng đầu,
 * add tạo dòng mới, delete xoá hết key.
 *
 * Mọi key test dùng hậu tố ngẫu nhiên và được xoá trong finally.
 */

require dirname(__DIR__, 3) . '/vendor/autoload.php';

// Package không nạp qua composer files (đụng tên hàm global của core), nên
// flow nào dùng API của nó – kể cả test – đều phải require bootstrap.
require dirname(__DIR__, 3) . '/vendor/jankx/flight-wordpress-concept/bootstrap.php';

use Jankx\Flight\WordpressConcept\Config;
use Jankx\Flight\WordpressConcept\Db\Connection;
use Jankx\Flight\WordpressConcept\Db\Meta;
use Jankx\Flight\WordpressConcept\Db\Posts;
use Jankx\Flight\WordpressConcept\WPError;

$config = Config::load(dirname(__DIR__, 3));
$conn   = Connection::instance();

$pass = 0;
$fail = 0;
$check = static function (string $label, bool $ok) use (&$pass, &$fail): void {
    printf("  [%s] %s\n", $ok ? 'PASS' : 'FAIL', $label);
    $ok ? $pass++ : $fail++;
};

echo "== Nền tảng ==\n";
$check('kết nối DB', ($conn->fetchValue('SELECT 1')) == 1);

$user = $conn->fetchOne('SELECT ID FROM ' . $config->table('users') . ' ORDER BY ID LIMIT 1');
$post = $conn->fetchOne(
    'SELECT ID, post_title, post_name, post_type FROM ' . $config->table('posts') . " WHERE post_status = 'publish' ORDER BY ID LIMIT 1"
);

if ($user === null || $post === null) {
    exit("Cần ít nhất một user và một bài viết đã publish trong DB.\n");
}

$userId = (int) $user['ID'];
$postId = (int) $post['ID'];
$suffix = substr(bin2hex(random_bytes(6)), 0, 12);

echo "\n== get_post / get_post_type / get_the_title ==\n";

$found = Posts::find($postId);
$check('Posts::find trả về đúng ID', $found !== null && (int) $found->ID === $postId);
$check('get_post(int) trả về object', is_object(get_post($postId)));
// Core trả null (không phải WP_Error): extension kiểm tra `if (!$post)`.
// Trả WP_Error sẽ lọt qua nhánh đó rồi đọc ->post_type trên đối tượng lỗi.
$check('get_post() không tồn tại → null', get_post(99999999) === null);
$check('get_post_type khớp DB', get_post_type($postId) === $post['post_type']);
$check('get_the_title khớp DB', get_the_title($postId) === (string) $post['post_title']);
$check('get_the_title của ID không tồn tại trả chuỗi rỗng', get_the_title(99999999) === '');
$check('get_post_type của ID không tồn tại trả false', get_post_type(99999999) === false);

echo "\n== get_post theo slug ==\n";
if ((string) $post['post_name'] !== '') {
    $bySlug = get_post((string) $post['post_name']);
    $check('get_post(slug) trả về đúng bài', is_object($bySlug) && (int) $bySlug->ID === $postId);
} else {
    $check('bỏ qua: bài viết không có slug', true);
}

echo "\n== User meta: $single, mảng, update, add, delete ==\n";

$key = 'jankx_fwc_test_' . $suffix;

$check('chưa có → trả chuỗi rỗng với $single', get_user_meta($userId, $key, true) === '');

update_user_meta($userId, $key, 'VI');
$check('update rồi đọc $single trả đúng', get_user_meta($userId, $key, true) === 'VI');

$all = get_user_meta($userId, $key);
$check('$single = false trả mảng 1 phần tử', is_array($all) && $all === ['VI']);

update_user_meta($userId, $key, 'USD');
$check('update lần hai ghi đè dòng đầu', get_user_meta($userId, $key, true) === 'USD');

$rows = $conn->fetchValue(
    'SELECT COUNT(*) FROM ' . $config->table('usermeta') . ' WHERE user_id = :u AND meta_key = :k',
    [':u' => $userId, ':k' => $key]
);
$check('không tạo dòng thừa khi update', (int) $rows === 1);

delete_user_meta($userId, $key);
$check('delete xoá hết key', get_user_meta($userId, $key, true) === '');

echo "\n== User meta: serialize mảng ==\n";

update_user_meta($userId, $key, ['a' => 1, 'b' => [2, 3]]);
$decoded = get_user_meta($userId, $key, true);
$check(
    'mảng được serialize/giữ nguyên cấu trúc',
    $decoded === ['a' => 1, 'b' => [2, 3]]
);

$raw = $conn->fetchValue(
    'SELECT meta_value FROM ' . $config->table('usermeta') . ' WHERE user_id = :u AND meta_key = :k',
    [':u' => $userId, ':k' => $key]
);
$check('giá trị được lưu dạng serialized trong DB', is_string($raw) && $raw === serialize(['a' => 1, 'b' => [2, 3]]));

delete_user_meta($userId, $key);

echo "\n== Post meta ==\n";

$pkey = 'jankx_fwc_test_' . $suffix;

update_post_meta($postId, $pkey, 42);
// Core đọc meta qua $wpdb rồi maybe_unserialize, nên số cũng về dạng chuỗi
// ('42'). So sánh lỏng để khớp hành vi thật của WordPress.
$check('post meta $single trả giá trị đúng', get_post_meta($postId, $pkey, true) == 42);

add_post_meta($postId, $pkey, 43);
$allPost = get_post_meta($postId, $pkey);
$check('add tạo dòng thứ hai, đọc ra danh sách', is_array($allPost) && count($allPost) === 2);

delete_post_meta($postId, $pkey);
$check('delete_post_meta xoá hết key', get_post_meta($postId, $pkey, true) === '');

echo "\n== Object cache trong request ==\n";

$check('đọc cache chưa có → false', wp_cache_get('khong_co', 'grp') === false);

wp_cache_set('k', 'v', 'grp');
$check('set rồi get trả đúng', wp_cache_get('k', 'grp') === 'v');
$check('group khác không thấy giá trị', wp_cache_get('k', 'grp_khac') === false);

wp_cache_delete('k', 'grp');
$check('delete xoá giá trị', wp_cache_get('k', 'grp') === false);

wp_cache_set('a', 1, 'grp_x');
wp_cache_set('b', 2, 'grp_x');
wp_cache_delete_group('grp_x');
$check('delete_group xoá cả nhóm', wp_cache_get('a', 'grp_x') === false && wp_cache_get('b', 'grp_x') === false);

wp_cache_set('c', 3, 'grp_y');
wp_cache_flush();
$check('flush xoá toàn bộ', wp_cache_get('c', 'grp_y') === false);

echo "\n== sanitize_title ==\n";
$check('bỏ dấu cách thành dấu gạch', sanitize_title('Bài Viết Mới') === 'bai-viet-moi');
$check('bỏ ký tự đặc biệt', sanitize_title('Hello, World!') === 'hello-world');
$check('rút gọn khoảng trắng', sanitize_title('a    b') === 'a-b');
$check('chuỗi rỗng dùng fallback', sanitize_title('', 'fallback') === 'fallback');

echo "\n== WP_Error ==\n";
$err = new WPError('code_x', 'thông báo', ['k' => 1]);
$check('is_wp_error nhận diện đúng', is_wp_error($err));
// Tên phương thức phải đúng như core: extension gọi get_error_code(), không
// phải camelCase.
$check('get_error_code trả về code', $err->get_error_code() === 'code_x');
$check('get_error_message trả về message', $err->get_error_message() === 'thông báo');
$check('->errors giữ cấu trúc [code => [[message, data]]]', $err->errors['code_x'][0][0] === 'thông báo');
$check('getErrorData trả về data', $err->get_error_data() === ['k' => 1]);
$check('is_wp_error(null) là false', !is_wp_error(null));

// ---- Dọn dẹp ----
Meta::delete('user', $userId, $key);
Meta::delete('post', $postId, $pkey);

$left = (int) $conn->fetchValue(
    'SELECT COUNT(*) FROM ' . $config->table('usermeta') . " WHERE user_id = :u AND meta_key LIKE 'jankx_fwc_test_%'",
    [':u' => $userId]
);
$check('không sót user meta test', $left === 0);

$leftPost = (int) $conn->fetchValue(
    'SELECT COUNT(*) FROM ' . $config->table('postmeta') . " WHERE post_id = :p AND meta_key LIKE 'jankx_fwc_test_%'",
    [':p' => $postId]
);
$check('không sót post meta test', $leftPost === 0);

echo "\nKết quả: {$pass} pass, {$fail} fail\n";
exit($fail === 0 ? 0 : 1);
