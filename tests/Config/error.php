<?php

return [
    'suppression' => [
        'doing_it_wrong' => [
            'enabled' => false,
            'functions' => ['wp_enqueue_script'],
            'patterns' => ['wp-editor']
        ],
        'php_errors' => [
            'enabled' => false,
            'messages' => []
        ]
    ]
];
