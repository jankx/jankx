<?php
/**
 * Kiểm tra Auth đọc cookie WordPress thật, không nạp WordPress.
 *
 * Salt được tính ĐỘC LẬP từ option trong DB (giống wp_salt() sẽ làm với
 * wp-config còn placeholder) chứ không gọi resolveSalt() của package – nếu
 * không, test sẽ tự khớp với chính lỗi của nó.
 */

declare(strict_types=1);

require dirname(__DIR__, 3) . '/vendor/autoload.php';

// Package không nạp qua composer files (đụng tên hàm global của core), nên
// flow nào dùng API của nó – kể cả test – đều phải require bootstrap.
require dirname(__DIR__, 3) . '/vendor/jankx/flight-wordpress-concept/bootstrap.php';

use Jankx\Flight\WordpressConcept\Auth\Auth;
use Jankx\Flight\WordpressConcept\Config;
use Jankx\Flight\WordpressConcept\Db\Connection;

$config = Config::load(dirname(__DIR__, 3));
$conn   = Connection::instance();
$prefix = $config->tablePrefix();

$opt = static function (string $name) use ($conn): string {
    $v = $conn->fetchValue(
        "SELECT option_value FROM wp_options WHERE option_name = :n LIMIT 1",
        [':n' => $name]
    );
    return is_string($v) ? $v : '';
};

$pass = 0;
$fail = 0;
$check = static function (string $label, bool $ok) use (&$pass, &$fail): void {
    printf("  [%s] %s\n", $ok ? 'PASS' : 'FAIL', $label);
    $ok ? $pass++ : $fail++;
};

// Atlas Connection mở rộng PDO nên phải prepare() trước khi execute().
$run = static function (string $sql, array $params) use ($conn): void {
    $conn->prepare($sql)->execute($params);
};

echo "== Nền tảng ==\n";
$check('DB kết nối được', $config->database()['name'] !== '');

// Salt độc lập: wp-config còn placeholder nên wp_salt() đọc option (không prefix).
$key  = $opt('logged_in_key');
$salt = $opt('logged_in_salt');
$check('option logged_in_key/salt tồn tại (không prefix)', $key !== '' && $salt !== '');
$realSalt = $key . $salt;

$cookieHash = md5($opt('siteurl'));
$cookieName = 'wordpress_logged_in_' . $cookieHash;
echo "  cookie: {$cookieName}\n";

$user = $conn->fetchOne(
    'SELECT ID, user_login, user_pass FROM ' . $prefix . 'users ORDER BY ID LIMIT 1'
);
if ($user === null) {
    exit("Không có user nào trong DB.\n");
}
echo "  user: {$user['user_login']} (ID {$user['ID']})\n";

// ---- Dựng cookie hợp lệ ----
$userPass = (string) $user['user_pass'];
$passFrag = str_starts_with($userPass, '$P$') || str_starts_with($userPass, '$2y$')
    ? substr($userPass, 8, 4)
    : substr($userPass, -4);

$expiration = time() + 3600;
$token      = bin2hex(random_bytes(16));
$sessionKey = hash('sha256', $token);

$session = [
    $sessionKey => [
        'expiration' => $expiration,
        'login'      => time(),
        'login_ip'   => '127.0.0.1',
        'user_id'    => (int) $user['ID'],
        'user_login' => $user['user_login'],
    ],
];

// WP lưu session_tokens với key KHÔNG prefix (get_user_meta($id,'session_tokens')),
// còn wp_capabilities thì CÓ prefix. Test trước ghi sai key nên luôn fail.
$metaKey = 'session_tokens';

$existingRow = $conn->fetchOne(
    "SELECT umeta_id, meta_value FROM {$prefix}usermeta
     WHERE user_id = :u AND meta_key = :k LIMIT 1",
    [':u' => (int) $user['ID'], ':k' => $metaKey]
);

$originalPayload = $existingRow['meta_value'] ?? null;
$existingSessions = [];
if (is_string($originalPayload)) {
    $decoded = @unserialize($originalPayload, ['allowed_classes' => false]);
    if (is_array($decoded)) {
        $existingSessions = $decoded;
    }
}

// Merge chứ không ghi đè: user thật có phiên đang hoạt động.
$merged = $existingSessions;
$merged[$sessionKey] = [
    'expiration' => $expiration,
    'login'      => time(),
    'login_ip'   => '127.0.0.1',
    'user_id'    => (int) $user['ID'],
    'user_login' => $user['user_login'],
];

if ($existingRow === null) {
    $run(
        "INSERT INTO {$prefix}usermeta (user_id, meta_key, meta_value)
         VALUES (:u, :k, :v)",
        [':u' => (int) $user['ID'], ':k' => $metaKey, ':v' => serialize($merged)]
    );
} else {
    $run(
        "UPDATE {$prefix}usermeta SET meta_value = :v WHERE umeta_id = :id",
        [':v' => serialize($merged), ':id' => (int) $existingRow['umeta_id']]
    );
}

$cookieKey = hash_hmac('md5', $user['user_login'] . '|' . $passFrag . '|' . $expiration . '|' . $token, $realSalt);
$cookieHmac = hash_hmac('sha256', $user['user_login'] . '|' . $expiration . '|' . $token, $cookieKey);
$validCookie = $user['user_login'] . '|' . $expiration . '|' . $token . '|' . $cookieHmac;

// Khôi phục đúng trạng thái meta cũ khi test kết thúc.
$cleanup = static function () use ($run, $prefix, $existingRow, $originalPayload, $metaKey, $user): void {
    if ($existingRow === null) {
        $run(
            "DELETE FROM {$prefix}usermeta WHERE user_id = :u AND meta_key = :k",
            [':u' => (int) $user['ID'], ':k' => $metaKey]
        );
        return;
    }
    $run(
        "UPDATE {$prefix}usermeta SET meta_value = :v WHERE umeta_id = :id",
        [':v' => $originalPayload, ':id' => (int) $existingRow['umeta_id']]
    );
};

try {
    echo "\n== Cookie hợp lệ ==\n";
    $_COOKIE = [$cookieName => $validCookie];
    Auth::reset();
    Auth::boot();

    $check('Auth::check() === true', Auth::check());
    $check('Auth::id() khớp user trong DB', Auth::id() === (int) $user['ID']);
    $check(
        'Auth::user()->user_login khớp',
        Auth::user() !== null && Auth::user()->user_login === $user['user_login']
    );
    $check('capabilities không rỗng', Auth::capabilities() !== []);

    echo "\n== Cookie bị can thiệp ==\n";
    $flipped = $validCookie;
    $flipped[strlen($flipped) - 1] = $flipped[strlen($flipped) - 1] === 'a' ? 'b' : 'a';
    $_COOKIE = [$cookieName => $flipped];
    Auth::reset();
    Auth::boot();
    $check('cookie sửa HMAC bị từ chối', Auth::check() === false);

    echo "\n== Cookie hết hạn ==\n";
    $expired = time() - 7200; // quá cả grace 1 giờ của AJAX
    $eKey  = hash_hmac('md5', $user['user_login'] . '|' . $passFrag . '|' . $expired . '|' . $token, $realSalt);
    $eHmac = hash_hmac('sha256', $user['user_login'] . '|' . $expired . '|' . $token, $eKey);
    $_COOKIE = [$cookieName => $user['user_login'] . '|' . $expired . '|' . $token . '|' . $eHmac];
    Auth::reset();
    Auth::boot();
    $check('cookie hết hạn bị từ chối', Auth::check() === false);

    echo "\n== Token không có trong session_tokens ==\n";
    $orphan = bin2hex(random_bytes(16));
    $oKey  = hash_hmac('md5', $user['user_login'] . '|' . $passFrag . '|' . $expiration . '|' . $orphan, $realSalt);
    $oHmac = hash_hmac('sha256', $user['user_login'] . '|' . $expiration . '|' . $orphan, $oKey);
    $_COOKIE = [$cookieName => $user['user_login'] . '|' . $expiration . '|' . $orphan . '|' . $oHmac];
    Auth::reset();
    Auth::boot();
    $check('token lạ bị từ chối dù HMAC đúng', Auth::check() === false);

    echo "\n== Guest ==\n";
    $_COOKIE = [];
    Auth::reset();
    Auth::boot();
    $check('không cookie thì là guest', Auth::check() === false && Auth::id() === 0);
    $check('guest không có quyền nào', Auth::can('manage_options') === false);
} finally {
    $cleanup();
    Auth::reset();
}

echo "\nKết quả: {$pass} pass, {$fail} fail\n";
exit($fail === 0 ? 0 : 1);