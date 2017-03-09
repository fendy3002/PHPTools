<?php

namespace App\Http\Controllers;

use App\User;
use App\Http\Controllers\Controller;

class ImportTextFileController extends Controller
{
    public function getIndex()
    {
        return view('importtextfile.index', ['results' => []]);
    }
    public function postIndex(){
        set_time_limit(3600);
        $viewModel = (object)['results' => []];
        $uuid = \QzPhp\Q::Z()->uuid();

        $uploaded = \Request::file('data');
        $uploadPath = '/storage/app/public/' . $uuid;
        $movePath = storage_path('app/public/');
        $uploaded->move($movePath, $uuid);

        $delimiter = \Request::input('delimiter');
        $struct = \Request::input('struct');
        $arrStruct = NULL;

        $filename = \Request::file('data')->getClientOriginalName();

        $importRequest = [
            "uuid" => $uuid,
            "file_name" => $filename,
            "schema" => $struct,
            "utc_created" => gmdate("c")
        ];
        $db = \DB::connection('');
        $db->table("import_request")->insert($importRequest);

        if(!empty($struct)){
            $convertedStruct = (array)json_decode($struct);
            $arrStruct = [];
            foreach($convertedStruct as $key => $value){
                $arrStruct[$this->formatName($key)] = $value;
            }
        }

        $moveFile = $movePath . $uuid;
        chmod($moveFile, 0777);

        $fileReader = new \QzPhp\FileReader();
        $readContent = $fileReader->readFileByLines($moveFile, 0, 1);
        $keys = explode($delimiter, $readContent->content);
        $keys = \QzPhp\Q::Z()->enum($keys)->select(function ($k){
            return $this->formatName($k);
        })->result();
        $this->createTable($uuid, $keys, $arrStruct);

        $this->dispatch(new \App\Jobs\TextFileImportJob([
            "uuid" => $uuid,
            "filepath" => $moveFile,
            "offset" => $readContent->pos,
            "columns" => $keys,
            "delimiter" => $delimiter
        ]));

        return view('importtextfile.index', (array)$viewModel);
    }
    private function formatValue($value){
        if($value == 'NULL') {
            dd($value);
        }
    }
    private function formatName($name){
        $from = ['.', ' ', '-', '!', '@', '#', '$'];
        $with = ['', '', '', '', '', '', ''];
        $result = str_replace($from, $with, $name);
        return strtolower($name);
    }

    private function createTable($uuid, $keys, $arrStruct){
        $db = \DB::connection('');
        $tableName = '_' . $uuid;

        if(!empty($arrStruct)){
            $columns = \QzPhp\Q::Z()->enum($keys)->select(
                function($k) use($arrStruct){
                    $field = 'varchar(1000)';
                    if(array_key_exists($this->formatName($k), $arrStruct)){
                        $field = $arrStruct[$this->formatName($k)];
                    }
                    return '`' . $this->formatName($k) . '` ' . $field;
                })->result();
        }
        else{
            $columns = \QzPhp\Q::Z()->enum($keys)->select(
                function($k){
                    return '`' . $this->formatName($k) . '` varchar(1000)';
                })->result();
        }
        
        $column = implode(', ', $columns);

        $query = "create table " . $tableName . ' ('. $column .')';
        $db->statement($query);
    }
}
