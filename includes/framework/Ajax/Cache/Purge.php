<?php

namespace Jankx\Ajax\Cache;

use Jankx\Cache\Purge\LiteSpeedPurgeClient;

/**
 * Purge cache từ Fast-AJAX sau khi controller ghi data (Strategy: chọn ngay
 * đường ngắn nhất tùy WordPress đã boot hay chưa).
 *
 * Standalone (ajax.php gọi thẳng, không nạp WordPress): không thể purge trực
 * tiếp — storage nằm ở object cache/file mà request này không với tới được.
 * Thay vào đó helper bắn một loopback không blocking tới endpoint
 * `?jankx_purge=<token>`; request loopback chạy WordPress đầy đủ nên storage,
 * edge header và query bucket đều được xử lý ở đó.
 *
 * Nhánh rewrite (WordPress đã boot): purge ngay trong request, không thêm
 * round-trip nào.
 *
 * Controller sau khi ghi data chỉ cần:
 *
 *     \Jankx\Ajax\Cache\Purge::tags(['post-' . $id, 'home']);
 *     \Jankx\Ajax\Cache\Purge::all();
 *
 * Lưu ý: giỏ hàng (transient per-user) KHÔNG cần gọi — request có cookie giỏ
 * hàng đã bị page cache loại trừ sẵn.
 *
 * @package Jankx\Ajax\Cache
 * @since 2.0.0
 */
final class Purge
{
    /**
     * Everything is stale: every cached page plus the query bucket.
     *
     * @return bool Whether the purge was dispatched.
     */
    public static function all(): bool
    {
        return self::dispatch('all');
    }

    /**
     * A selective purge by cache tags (and/or absolute URLs).
     *
     * @param string[] $tags Cache tags, e.g. ['post-12', 'home'].
     * @param string[] $urls Absolute URLs.
     * @return bool Whether the purge was dispatched.
     */
    public static function tags(array $tags, array $urls = []): bool
    {
        $tags = self::clean($tags);
        $urls = self::clean($urls);

        if (empty($tags) && empty($urls)) {
            return self::all();
        }

        return self::dispatch('selective', $tags, $urls);
    }

    /**
     * @param string   $scope `all` or `selective`.
     * @param string[] $tags  Cache tags.
     * @param string[] $urls  Absolute URLs.
     * @return bool
     */
    private static function dispatch(string $scope, array $tags = [], array $urls = []): bool
    {
        $app = self::bootedApplication();

        if ($app !== null) {
            if ($scope === 'all') {
                $app->make('cache.page')->purge(['all'], []);

                if ($app->bound('cache.query')) {
                    $app->make('cache.query')->flushBucket(self::bucket($app));
                }

                return true;
            }

            return (bool) $app->make('cache.page')->purge($tags, $urls);
        }

        return self::loopback($scope, $tags, $urls);
    }

    /**
     * The container, but only when WordPress already booted it — never boot
     * it from here, the standalone request exists to stay fast.
     *
     * @return \Jankx\Foundation\Application|null
     */
    private static function bootedApplication()
    {
        if (!class_exists(\Jankx\Foundation\Application::class, false)) {
            return null;
        }

        $app = \Jankx\Foundation\Application::getInstance();

        return $app->bound('cache.page') ? $app : null;
    }

    /**
     * Fire the loopback purge endpoint (token authenticated, non blocking).
     *
     * @param string   $scope `all` or `selective`.
     * @param string[] $tags  Cache tags.
     * @param string[] $urls  Absolute URLs.
     * @return bool
     */
    private static function loopback(string $scope, array $tags, array $urls): bool
    {
        if (!function_exists('get_option') || !function_exists('home_url') || !function_exists('wp_remote_get')) {
            return false;
        }

        $token = get_option(LiteSpeedPurgeClient::TOKEN_OPTION, '');
        if (!is_string($token) || $token === '') {
            // The cache system is not enabled on this site.
            return false;
        }

        $query = [
            'jankx_purge' => $token,
            'jankx_scope' => $scope,
            '_'           => (string) time(),
        ];

        if (!empty($tags)) {
            $query['jankx_tags'] = implode(',', $tags);
        }
        if (!empty($urls)) {
            $query['jankx_urls'] = implode(',', $urls);
        }

        $response = wp_remote_get(home_url('/?' . http_build_query($query)), [
            'timeout'     => 3,
            'blocking'    => false,
            'sslverify'    => false,
            'redirection' => 0,
        ]);

        return !(function_exists('is_wp_error') && is_wp_error($response));
    }

    /**
     * Configured query bucket.
     *
     * @param \Jankx\Foundation\Application $app Container.
     * @return string
     */
    private static function bucket($app): string
    {
        $bucket = $app->bound('config') ? $app['config']->get('cache.query.bucket', 'posts') : 'posts';

        return is_string($bucket) && $bucket !== '' ? $bucket : 'posts';
    }

    /**
     * @param array $values Raw list.
     * @return string[]
     */
    private static function clean(array $values): array
    {
        $clean = [];
        foreach ($values as $value) {
            $value = trim((string) $value);
            if ($value !== '') {
                $clean[] = $value;
            }
        }

        return array_values(array_unique($clean));
    }
}
