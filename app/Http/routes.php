<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/
Route::group(['middleware' => ['web']], function () {
    Route::get('/', 'HomeController@index');
    Route::get('/import', 'ImportController@getIndex');
    Route::post('/import', 'ImportController@postIndex');
    Route::get('/jsontotable', 'JsonToTableController@getIndex');
    Route::post('/jsontotable', 'JsonToTableController@postIndex');
});
Route::group(['prefix' => 'api', 'namespace' => 'Api'], function () {

});
