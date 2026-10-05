<?php

declare(strict_types=1);

/**
 * Báo cáo hàm WordPress mà extension gọi nhưng package chưa cung cấp.
 *
 * Cần vì extension chỉ "chết âm thầm": thiếu hàm thì fatal error lúc runtime,
 * không phải lúc nạp. Lần trước, cart get chạy được với guest nhưng hỏng với
 * người đã đăng nhập vì thiếu get_user_meta().
 *
 * Cách chạy:
 *   php tests/Integration/FastAjax/wp-api-gaps.php
 *
 * Exit code 0 = không còn gap. Kết quả in ra là danh sách để xử lý.
 *
 * Cách đếm: đọc token của mọi file PHP trong extensions/ và includes/, lấy
 * các lời gọi hàm (không phải method), rồi trừ đi:
 *   - hàm đã có sau khi boot (package + PHP built-in)
 *   - hàm chính extension đó định nghĩa
 *   - hàm theme định nghĩa trong includes/ (chỉ để không báo nhầm)
 */

require dirname(__DIR__, 3) . '/vendor/autoload.php';

// Package không nạp qua composer files (đụng tên hàm global của core), nên
// flow nào dùng API của nó – kể cả test – đều phải require bootstrap.
require dirname(__DIR__, 3) . '/vendor/jankx/flight-wordpress-concept/bootstrap.php';

use Jankx\Flight\WordpressConcept\Bootstrap;

$_SERVER['HTTPS']          = 'on';
$_SERVER['HTTP_HOST']      = 'nibitour.localhost';
$_SERVER['REQUEST_METHOD'] = 'GET';
$_SERVER['REQUEST_URI']    = '/jankx-ajax/jankx/ping/index';

$themeDir = dirname(__DIR__, 3);
$childDir = dirname($themeDir) . '/nibitour';

// Boot có thể chết vì chính các hàm đang thiếu – mà đó là thứ ta cần quét.
// Hàm của package đã nạp qua composer "files" nên vẫn có trong
// get_defined_functions() dù boot ném exception.
try {
    Bootstrap::boot($themeDir);
} catch (\Throwable $exception) {
    fwrite(STDERR, 'Cảnh báo: boot() thất bại – ' . $exception->getMessage() . "\n");
    fwrite(STDERR, "Vẫn quét được, các hàm package đã nạp qua composer files.\n\n");
}

/** @return string[] */
function php_files(string $dir): array
{
    if (!is_dir($dir)) {
        return [];
    }

    $out  = [];
    // libs/ là thư viện của bên thứ ba đóng gói kèm (phpunit trong onepay…),
    // không phải code của extension nên không tính vào gap.
    $skip = ['/tests/', '/vendor/', '/node_modules/', '/libs/'];

    $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir, FilesystemIterator::SKIP_DOTS));

    foreach ($it as $file) {
        if (! $file->isFile() || $file->getExtension() !== 'php') {
            continue;
        }

        $path = $file->getPathname();

        foreach ($skip as $needle) {
            if (str_contains($path, $needle)) {
                continue 2;
            }
        }

        $out[] = $path;
    }

    return $out;
}

/**
 * Tên hàm được định nghĩa trong file, kèm namespace của file.
 *
 * @return array<string, true> khóa "name" hoặc "Namespace\name"
 */
function defined_functions(string $file): array
{
    $src  = (string) file_get_contents($file);
    $ns   = '';
    $out  = [];

    if (preg_match('/^\s*namespace\s+([^;{]+)[;{]/m', $src, $m) === 1) {
        $ns = trim($m[1]) . '\\';
    }

    if (preg_match_all('/^\s*(?:(?:public|protected|private|static|final|abstract)\s+)*function\s+&?(\w+)\s*\(/mi', $src, $m) > 0) {
        foreach ($m[1] as $name) {
            $out[strtolower($ns . $name)] = true;
            $out[strtolower($name)]       = true;
        }
    }

    return $out;
}

/**
 * Các lời gọi hàm trong file: tên thường => [file => dòng].
 *
 * @return array<string, array<string, int>>
 */
function function_calls(string $file): array
{
    $tokens = token_get_all((string) file_get_contents($file));
    $count  = count($tokens);
    $out    = [];

    for ($i = 0; $i < $count; $i++) {
        $t = $tokens[$i];

        if (!is_array($t) || $t[0] !== T_STRING) {
            continue;
        }

        $j = $i + 1;
        while ($j < $count && is_array($tokens[$j]) && $tokens[$j][0] === T_WHITESPACE) {
            $j++;
        }
        if ($j >= $count || $tokens[$j] !== '(') {
            continue;
        }

        $k = $i - 1;
        while ($k >= 0 && is_array($tokens[$k]) && $tokens[$k][0] === T_WHITESPACE) {
            $k--;
        }
        $prev = $k >= 0 ? $tokens[$k] : null;

        if (is_array($prev)) {
            $skip = [
                T_OBJECT_OPERATOR, T_DOUBLE_COLON, T_FUNCTION, T_NEW, T_NS_SEPARATOR,
                T_CONST, T_CLASS, T_INTERFACE, T_TRAIT, T_ENUM, T_EXTENDS, T_IMPLEMENTS,
                T_USE, T_INSTANCEOF, T_GOTO, T_DECLARE, T_STRING, T_VARIABLE, T_NAME_QUALIFIED,
            ];
            if (in_array($prev[0], $skip, true)) {
                continue;
            }
        }

        $out[strtolower($t[1])][$file] = $t[2];
    }

    return $out;
}

$extensionFiles = php_files($childDir . '/extensions');
$themeFiles     = php_files($themeDir . '/includes');

// Hàm do chính extension và theme định nghĩa.
$defined = [];
foreach ([...$extensionFiles, ...$themeFiles] as $file) {
    foreach (defined_functions($file) as $name => $_) {
        $defined[$name] = true;
    }
}

// Hàm PHP built-in và hàm package đã cung cấp.
$loaded = [];

// ['user'] là hàm userland (package vừa nạp) – những hàm này đã có sẵn.
// ['internal'] là hàm built-in của PHP (array_map, str_replace…). Phải loại cả
// hai, nếu không danh sách gap bị ngập bởi hàm của ngôn ngữ.
foreach (get_defined_functions()['user'] as $name) {
    $loaded[strtolower($name)] = true;
}

foreach (get_defined_functions()['internal'] as $name) {
    $loaded[strtolower($name)] = true;
}

$missing = [];
foreach ($extensionFiles as $file) {
    foreach (function_calls($file) as $name => $places) {
        if (isset($loaded[$name]) || isset($defined[$name])) {
            continue;
        }
        foreach ($places as $where => $line) {
            $missing[$name][substr($where, strlen($childDir) + 1)] = $line;
        }
    }
}

ksort($missing);

$total = 0;
foreach ($missing as $name => $places) {
    $first = array_key_first($places);
    printf("  %-30s %3d chỗ   %s:%d\n", $name . '()', count($places), $first, $places[$first]);
    $total += count($places);
}

printf(
    "\nQuét %d file extension. Thiếu %d hàm (%d chỗ gọi).\n",
    count($extensionFiles),
    count($missing),
    $total
);

exit($missing === [] ? 0 : 1);
