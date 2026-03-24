<?php

namespace App\Services;

use Jankx\Foundation\Application;

class OptilarityClient
{
    protected $baseUrl = 'https://optilarity.top';
    protected $app;

    public function __construct(Application $app)
    {
        $this->app = $app;
        if (defined('OPTILARITY_API_URL')) {
            $this->baseUrl = OPTILARITY_API_URL;
        }
    }

    public function post($endpoint, $body = [], $headers = [])
    {
        $url = $this->baseUrl . $endpoint;
        $response = wp_remote_post($url, [
            'headers' => array_merge([
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ], $headers),
            'body' => json_encode($body),
            'timeout' => 15,
        ]);

        return $this->processResponse($response);
    }

    public function get($endpoint, $headers = [])
    {
        $url = $this->baseUrl . $endpoint;
        $response = wp_remote_get($url, [
            'headers' => array_merge([
                'Accept' => 'application/json',
            ], $headers),
            'timeout' => 15,
        ]);

        return $this->processResponse($response);
    }

    protected function processResponse($response)
    {
        if (is_wp_error($response)) {
            return [
                'success' => false,
                'message' => $response->get_error_message(),
            ];
        }

        $code = wp_remote_retrieve_response_code($response);
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);

        if ($code >= 400) {
            return [
                'success' => false,
                'message' => $data['message'] ?? 'API Error',
                'code' => $code,
                'data' => $data,
            ];
        }

        return array_merge(['success' => true], (array)$data);
    }

    public function getBaseUrl()
    {
        return $this->baseUrl;
    }
}
