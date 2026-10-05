<?php

/**
 * Kiểm tra lớp cache DB của package: Options và Transient.
 *
 * Script này chạy trực tiếp trên database thật (nó dùng chung wp_options với
 * WordPress), nên nó tự dọn dẹp mọi option tạm trước khi kết thúc. Chạy:
 *
 *   php tests/Integration/FastAjax/cache.php
 */

declare(strict_types=1);

require dirname(__DIR__, 3) . '/vendor/autoload.php';

// Package không nạp qua composer files (đụng tên hàm global của core), nên
// flow nào dùng API của nó – kể cả test – đều phải require bootstrap.
require dirname(__DIR__, 3) . '/vendor/jankx/flight-wordpress-concept/bootstrap.php';

use Jankx\Flight\WordpressConcept\Bootstrap;
use Jankx\Flight\WordpressConcept\Cache\Options;
use Jankx\Flight\WordpressConcept\Cache\Transient;

Bootstrap::boot(dirname(__DIR__, 3));

$pass = 0;
$fail = 0;

$check = static function (string $label, bool $ok) use (&$pass, &$fail): void {
    printf("  [%s] %s\n", $ok ? 'PASS' : 'FAIL', $label);
    $ok ? $pass++ : $fail++;
};

$suffix  = bin2hex(random_bytes(4));
$tmpKey  = '_fwc_t_' . $suffix;
$tmpOpt  = 'jankx_fwc_test_' . $suffix;

$cleanup = static function () use ($tmpKey, $tmpOpt): void {
    Transient::delete($tmpKey);
    Options::delete($tmpOpt);
};

try {
    echo "== Transient ==\n";
    $check('transient chưa có trả false', Transient::get($tmpKey) === false);

    Transient::set($tmpKey, ['a' => 1, 'b' => 'x'], 60);
    $check('đọc lại đúng mảng sau serialize', Transient::get($tmpKey) === ['a' => 1, 'b' => 'x']);

    Transient::set($tmpKey, 's', 0);
    $check('ttl = 0 nghĩa là vĩnh viễn', Transient::get($tmpKey) === 's');
    $check('ttl = 0 xoá option timeout cũ', get_option('_transient_timeout_' . $tmpKey) === false);

    Transient::set($tmpKey, 1, 1);
    $check('ghi option timeout = time() + ttl', (int) get_option('_transient_timeout_' . $tmpKey) === time() + 1);

    // Giả lập quá hạn bằng cách ghi timeout nằm trong quá khứ.
    Options::setRaw('_transient_timeout_' . $tmpKey, (string) (time() - 10));
    Transient::get($tmpKey);
    $check('transient hết hạn trả false', Transient::get($tmpKey) === false);
    $check(
        'hết hạn thì dọn cả option giá trị lẫn timeout',
        get_option('_transient_' . $tmpKey) === false
            && get_option('_transient_timeout_' . $tmpKey) === false
    );

    Transient::set($tmpKey, 'x', 60);
    $check('delete_transient trả true khi có', Transient::delete($tmpKey) === true);
    $check('sau delete trả false', Transient::get($tmpKey) === false);

    echo "\n== Options ==\n";
    $check('option chưa có trả default', Options::get($tmpOpt, 'dflt') === 'dflt');
    $check('add_option lần đầu trả true', Options::add($tmpOpt, ['x' => 1]) === true);
    $check('add_option lần hai trả false (không ghi đè)', Options::add($tmpOpt, ['x' => 2]) === false);
    $check('đọc lại đúng giá trị đã lưu', Options::get($tmpOpt) === ['x' => 1]);
    $check('update trả true khi giá trị đổi', Options::update($tmpOpt, ['x' => 9]) === true);
    $check('update trả false khi giá trị không đổi', Options::update($tmpOpt, ['x' => 9]) === false);
    $check('giá trị sau update đúng', Options::get($tmpOpt) === ['x' => 9]);
    $check('delete trả true', Options::delete($tmpOpt) === true);
    $check('sau delete trả default', Options::get($tmpOpt, 'dflt') === 'dflt');
} finally {
    $cleanup();
}

echo "\nKết quả: {$pass} pass, {$fail} fail\n";
exit($fail === 0 ? 0 : 1);