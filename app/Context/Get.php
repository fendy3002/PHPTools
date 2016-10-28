<?php
namespace App\Context;

class Get{
    private static $context;
    public static function context(){
        if(empty($context)){
            $context = new Get();
            return $context;
        }
    }

    public $threadCount = 20;
}
