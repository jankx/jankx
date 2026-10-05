<?php

declare(strict_types=1);

/**
 * Kiểm tra cart AJAX khi ĐÃ ĐĂNG NHẬP, không nạp WordPress.
 *
 * Đường này từng hỏng: CurrencyManager đọc get_user_meta() nên mọi request của
 * người dùng đã đăng nhập đều fail 500, còn guest thì pass và che mất lỗi.
 *
 * Không chỉ kiểm tra "không lỗi": test đặt user meta là USD rồi đòi giá phải
 * được định dạng theo USD. Nếu get_user_meta() trả sai hoặc trả rỗng thì giá
 * vẫn ra VND và test fail – đó là trường hợp mà endpoint chạy trơn không bắt
 * được.
 *
 * Mọi thay đổi DB được hoàn tác bằng shutdown function, vì ajax.php gọi exit.
 */

require dirname(__DIR__, 3) . '/vendor/autoload.php';

use Jankx\Flight\WordpressConcept\Config;
use Jankx\Flight\WordpressConcept\Db\Connection;

/**
 * Key user meta mà CurrencyManager đọc.
 */
const SESSION_KEY = 'jankx_current_currency';

$config = Config::load(dirname(__DIR__, 3));
$conn   = Connection::instance();
$prefix = $config->tablePrefix();

$usermeta = $config->table('usermeta');

$opt = static fn (string $name): string => (string) $conn->fetchValue(
    'SELECT option_value FROM ' . $config->table('options') . ' WHERE option_name = :n',
    [':n' => $name]
);

$realSalt   = $opt('logged_in_key') . $opt('logged_in_salt');
$cookieName = 'wordpress_logged_in_' . md5($opt('siteurl'));

$user = $conn->fetchOne('SELECT ID, user_login, user_pass FROM ' . $prefix . 'users ORDER BY ID LIMIT 1');

if ($user === null) {
    exit("Không có user nào trong DB.\n");
}

$userId   = (int) $user['ID'];
$userPass = (string) $user['user_pass'];
$passFrag = str_starts_with($userPass, '$P$') || str_starts_with($userPass, '$2y$')
    ? substr($userPass, 8, 4)
    : substr($userPass, -4);

$expiration = time() + 3600;
$token      = bin2hex(random_bytes(16));
$sessionKey = hash('sha256', $token);

// ---- Ghi session token: merge, không đè các phiên đang hoạt động ----
$tokenRow = $conn->fetchOne(
    "SELECT umeta_id, meta_value FROM {$usermeta} WHERE user_id = :u AND meta_key = :k LIMIT 1",
    [':u' => $userId, ':k' => 'session_tokens']
);

$originalTokens = $tokenRow['meta_value'] ?? null;
$sessions       = is_string($originalTokens)
    ? (@unserialize($originalTokens, ['allowed_classes' => false]) ?: [])
    : [];

$sessions[$sessionKey] = [
    'expiration' => $expiration,
    'login'      => time(),
    'login_ip'   => '127.0.0.1',
    'user_id'    => $userId,
    'user_login' => $user['user_login'],
];

if ($tokenRow === null) {
    $conn->prepare("INSERT INTO {$usermeta} (user_id, meta_key, meta_value) VALUES (:u, :k, :v)")
        ->execute([':u' => $userId, ':k' => 'session_tokens', ':v' => serialize($sessions)]);
} else {
    $conn->prepare("UPDATE {$usermeta} SET meta_value = :v WHERE umeta_id = :id")
        ->execute([':v' => serialize($sessions), ':id' => (int) $tokenRow['umeta_id']]);
}

// ---- User meta tiền tệ: USD ----
$currencyRow = $conn->fetchOne(
    "SELECT umeta_id, meta_value FROM {$usermeta} WHERE user_id = :u AND meta_key = :k LIMIT 1",
    [':u' => $userId, ':k' => SESSION_KEY]
);
$originalCurrency = $currencyRow['meta_value'] ?? null;

$conn->prepare("DELETE FROM {$usermeta} WHERE user_id = :u AND meta_key = :k")
    ->execute([':u' => $userId, ':k' => SESSION_KEY]);
$conn->prepare("INSERT INTO {$usermeta} (user_id, meta_key, meta_value) VALUES (:u, :k, :v)")
    ->execute([':u' => $userId, ':k' => SESSION_KEY, ':v' => 'USD']);

// ---- Hoàn tác, chạy cả khi ajax.php exit ----
register_shutdown_function(static function () use (
    $conn, $usermeta, $userId, $tokenRow, $originalTokens, $currencyRow, $originalCurrency
): void {
    if ($tokenRow === null) {
        $conn->prepare("DELETE FROM {$usermeta} WHERE user_id = :u AND meta_key = :k")
            ->execute([':u' => $userId, ':k' => 'session_tokens']);
    } else {
        $conn->prepare("UPDATE {$usermeta} SET meta_value = :v WHERE umeta_id = :id")
            ->execute([':v' => $originalTokens, ':id' => (int) $tokenRow['umeta_id']]);
    }

    $conn->prepare("DELETE FROM {$usermeta} WHERE user_id = :u AND meta_key = :k")
        ->execute([':u' => $userId, ':k' => SESSION_KEY]);

    if ($currencyRow !== null) {
        $conn->prepare("UPDATE {$usermeta} SET meta_value = :v WHERE umeta_id = :id")
            ->execute([':v' => $originalCurrency, ':id' => (int) $currencyRow['umeta_id']]);
    }
});

$cookieKey  = hash_hmac('md5', $user['user_login'] . '|' . $passFrag . '|' . $expiration . '|' . $token, $realSalt);
$cookieHmac = hash_hmac('sha256', $user['user_login'] . '|' . $expiration . '|' . $token, $cookieKey);

$_SERVER['HTTPS']          = 'on';
$_SERVER['HTTP_HOST']      = 'nibitour.localhost';
$_SERVER['REQUEST_METHOD'] = 'GET';
$_SERVER['REQUEST_URI']    = '/jankx-ajax/ecommerce/cart/get';

// Không đặt currency cookie: buộc CurrencyManager đi qua nhánh user meta.
$_COOKIE[$cookieName] = $user['user_login'] . '|' . $expiration . '|' . $token . '|' . $cookieHmac;

// ---- Chặn gọi mạng ----
// Chọn tiền tệ khác mặc định sẽ khiến converter gọi API ngoài. Test này kiểm tra
// việc đọc user meta, không kiểm tra tỷ giá, nên pre-seed cache để không phụ
// thuộc mạng (và không mất vài trăm ms mỗi lần chạy).
//
// CacheDecorator dùng hai dạng key khác nhau, và GIÁ TRỊ CŨNG KHÁC NHAU:
//   jankx_currency_rate_<md5("FROM_TO")>            → tỷ giá
//   jankx_currency_convert_<md5("AMOUNT_FROM_TO")>  → số tiền ĐÃ quy đổi
// Giá trị cart rỗng nên amount = 0, và 0 quy đổi vẫn phải là 0.
$defaultCurrency = (string) ($opt('jankx_default_currency') ?: 'VND');

wp_cache_set('jankx_currency_rate_' . md5("{$defaultCurrency}_USD"), 1.0, '', 60);
wp_cache_set('jankx_currency_convert_' . md5("0_{$defaultCurrency}_USD"), 0.0, '', 60);

// ---- Kiểm tra kết quả ----
// ajax.php gọi exit, nên phải chấm điểm trong shutdown function.
register_shutdown_function(static function (): void {
    $pass = 0;
    $fail = 0;
    $check = static function (string $label, bool $ok) use (&$pass, &$fail): void {
        printf("  [%s] %s\n", $ok ? 'PASS' : 'FAIL', $label);
        $ok ? $pass++ : $fail++;
    };

    $body = (string) ob_get_contents();
    $json = json_decode($body, true);

    $check('response là JSON hợp lệ', is_array($json));
    $check('request thành công', ($json['success'] ?? false) === true);

    $total = (string) ($json['data']['formatted_total'] ?? '');

    // Đây là điều kiện quan trọng: '$' nghĩa là user meta đã được đọc và áp dụng.
    // Nếu get_user_meta() sai, giá sẽ vẫn theo mặc định VND ('₫').
    $check('giá dùng tiền tệ trong user meta (USD)', str_contains($total, '$'));
    $check('không rơi về mặc định VND', ! str_contains($total, '₫'));
    // Cart rỗng nên tổng phải bằng 0. Đây là chỗ bắt được việc seed cache sai
    // kiểu: 'convert' cache SỐ TIỀN ĐÃ QUY ĐỔI, nên seed nhầm sẽ ra tổng = 1.
    $check('tổng tiền của cart rỗng bằng 0', ($json['data']['total'] ?? null) === 0);

    echo "\nKết quả: {$pass} pass, {$fail} fail\n";
    exit($fail === 0 ? 0 : 1);
});

ob_start();
require dirname(__DIR__, 3) . '/ajax.php';
