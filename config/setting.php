<?php
return [
    'cdn' => [
        'url' => env('CDN_URL'),
        'key' => env('CDN_KEY'),
        'module' => 'landmark',
        'path' => [
            'add' => '/api/image/add.php',
            'verify' => '/api/image/verify.php',
            'delete' => '/api/image/delete.php'
        ]
    ]
];
