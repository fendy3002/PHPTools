<?php

namespace App\Http\Controllers;

use App\User;
use App\Http\Controllers\Controller;
use QzPhp\Q;

class JsonToTableController extends Controller
{
    public function getIndex()
    {
        return view('jsontotable.index', ['results' => []]);
    }
    public function postIndex(){
        set_time_limit(3600);
        $viewModel = (object)['results' => []];
        $table = \Request::input('table');
        if(empty($table)){
            return redirect(url('/jsontotable?error=Table is empty'));
        }
        $json = \Request::input('json');
        if(empty($json)){
            return redirect(url('/jsontotable?error=JSON is empty'));
        }
        //try{
            $data = Q::Z()->enum(json_decode($json))->select(function($k){
                return (array)$k;
            })->result();

            \DB::table($table)->insert($data);

            return redirect(url('/jsontotable'));
        /*} catch(\Exception $ex){
            return redirect(url('/jsontotable?error=' . $ex->getMessage()));
        }*/
    }
}
