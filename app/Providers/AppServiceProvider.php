<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        $this->app->bind('QzPhp\Logs\ILog', 'QzPhp\Logs\ConsoleLog');
        $this->app->bind('QueueLog', function ($app) {
            $fileLog = new \QzPhp\Logs\FileLog(env('QUEUE_LOG_PATH', storage_path('logs/queue.log')));
            $timedPrefix = new \QzPhp\Logs\PrefixTimeLog($fileLog, '', 'c');
            return $timedPrefix;
        });
        //
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
