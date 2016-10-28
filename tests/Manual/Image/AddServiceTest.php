<?php
namespace Tests\Manual\Image;
use QzPhp\Q;

class AddServiceTest extends \TestCase
{
    public function test(){
        $config = [
            'url' => 'http://cdn.sss.sss',
            'key' => '29mYpdGItR2xDtdqpTFTe5HkLfogcEyu',
            'module' => 'landmark',
            'path' => [
                'add' => '/api/image/add.php',
                'verify' => '/api/image/verify.php'
            ]
        ];
        /* create file */
        $path = __DIR__;
        touch(Q::Z()->io()->combine($path, '001.txt'));
        touch(Q::Z()->io()->combine($path, '002.txt'));

        $addService = new \App\Services\Image\AddService($config);
        $addService->submit('10001', [
            (object)['path' => Q::Z()->io()->combine($path, '001.txt'), 'name' => '001.txt'],
            (object)['path' => Q::Z()->io()->combine($path, '002.txt'), 'name' => '002.txt']
        ]);

        unlink(Q::Z()->io()->combine($path, '001.txt'));
        unlink(Q::Z()->io()->combine($path, '002.txt'));
    }
}
