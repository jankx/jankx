<?php

/**
 * OPcache preload – nạp sẵn toàn bộ mã nguồn vào OPcache khi web server khởi
 * động, để request đầu tiên (và mọi request sau khi restart) không phải compile
 * file PHP nào nữa. Đặc biệt có lợi cho fast-AJAX (ajax.php) vốn boot rất
 * nhiều class của vendor/jankx/flight-wordpress-concept.
 *
 * Cấu hình (php.ini của web SAPI – lsphp/PHP-FPM, KHÔNG phải CLI):
 *
 *     opcache.enable=1
 *     opcache.memory_consumption=128
 *     opcache.max_accelerated_files=2000
 *     opcache.preload=/abs/path/wp-content/themes/jankx/opcache-preload.php
 *     ; opcache.preload_user=www-data   ; bắt buộc khi master process chạy root
 *     ; opcache.validate_timestamps=0   ; production: không re-stat file, deploy
 *                                       ; = restart PHP
 *
 * Chạy tay để kiểm tra manifest:
 *
 *     php opcache-preload.php
 *
 * (CLI thường tắt OPcache → chế độ tay chỉ validate được danh sách file;
 *  việc compile thật xảy ra trong preload process của web SAPI.)
 *
 * Manifest do Jankx\Support\Opcache\Warmup dựng – dùng chung với
 * `wp jankx cache warmup`.
 *
 * @package Jankx
 */

$autoload = __DIR__ . '/vendor/autoload.php';
if (is_readable($autoload)) {
    require $autoload;
}

if (!class_exists(\Jankx\Support\Opcache\Warmup::class)) {
    if (PHP_SAPI === 'cli') {
        fwrite(STDERR, "Thiếu vendor/autoload.php – chạy composer install trước.\n");
    }

    return;
}

// Trong process preload, opcache.preload trỏ đúng vào file này.
$isPreload = (string) ini_get('opcache.preload') === (string) __FILE__
    || (string) ini_get('opcache.preload') === (string) realpath(__FILE__);

$warmup = new \Jankx\Support\Opcache\Warmup(
    \Jankx\Support\Opcache\Warmup::themeDirs(__DIR__)
);
$files = $warmup->manifest();

if (\Jankx\Support\Opcache\Warmup::isStarted()) {
    $stats = $warmup->compile($files);
    $line = sprintf(
        'jankx opcache preload: %d/%d file đã compile, lỗi %d, %.2fs',
        $stats['compiled'],
        count($files),
        $stats['failed'],
        $stats['elapsed']
    );

    if (!empty($stats['messages'])) {
        $line .= ' – ' . implode('; ', array_slice($stats['messages'], 0, 3));
    }

    if ($stats['failed'] > 0 && PHP_SAPI !== 'cli') {
        error_log($line);
    }
} else {
    $stats = $warmup->validate($files);
    $line = sprintf(
        'jankx opcache preload: OPcache chưa start – chỉ validate %d/%d file',
        $stats['readable'],
        count($files)
    );

    if (!empty($stats['missing'])) {
        $line .= ' – thiếu: ' . implode(', ', array_slice($stats['missing'], 0, 3));
    }

    if (PHP_SAPI !== 'cli') {
        error_log($line);
    }
}

if (!$isPreload && PHP_SAPI === 'cli') {
    echo $line, PHP_EOL;
}
