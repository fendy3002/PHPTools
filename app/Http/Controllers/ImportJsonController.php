<?php

namespace App\Http\Controllers;

use App\User;
use App\Http\Controllers\Controller;

class ImportJsonController extends Controller
{
    public function getIndex()
    {
        return view('importjson.index', ['results' => []]);
    }
    public function postIndex(){
        set_time_limit(3600);
        $viewModel = (object)[
            'results' => []
        ];
        $uuid = \QzPhp\Q::Z()->uuid();

        $uploaded = \Request::file('data');
        $uploadPath = '/storage/app/public/' . $uuid;
        $movePath = storage_path('app/public/');
        $uploaded->move($movePath, $uuid);

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

        $tableName = 't_' . $uuid;

        $convertedStruct = (array)json_decode($struct);
        $arrStruct = [];
        $columnDefinition = '';
        $isFirst = true;
        foreach($convertedStruct as $key => $value){
            if(!$isFirst) {
                $columnDefinition .= ",";
            }
            $columnDefinition .= $key . " " . ($value ?: "varchar(1000) ");
            $arrStruct[$this->formatName($key)] = null;
            $isFirst = false;
        }
        $createStatement = "create table `$tableName` ($columnDefinition);";
        echo $createStatement;
        $db->statement($createStatement);

        $moveFile = $movePath . $uuid;
        chmod($moveFile, 0777);

        $fileContent = file_get_contents($moveFile);
        $jsonContent = json_decode($fileContent);

        $toInsert = [];
        foreach($jsonContent as $jsonObj){
            $jsonArr = [];
            foreach((array)$jsonObj as $key => $value){
                $jsonArr[$this->formatName($key)] = $value;
            }
            $toInsert[] = \QzPhp\Q::Z()->arrayIntersect(
                array_merge([], $arrStruct),
                $jsonArr
            );
            if(count($toInsert) % 1000 == 0){
                print_r($toInsert);
                $db->table($tableName)->insert($toInsert);
                $toInsert = [];
            }
        }
        if(count($toInsert) > 0){
            $db->table($tableName)->insert($toInsert);
        }

        return view('importjson.index', (array)$viewModel);
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

    public function clearTmp(){
        $query = "SET @tables = NULL;
            SELECT GROUP_CONCAT(table_schema, '.', table_name) INTO @tables FROM information_schema.tables
              WHERE table_schema = 'tmp_db' AND table_name not in ('lv_failed_jobs','lv_migrations','lv_queue_jobs');

            SET @tables = CONCAT('DROP TABLE ', @tables);
            PREPARE stmt1 FROM @tables;
            EXECUTE stmt1;
            DEALLOCATE PREPARE stmt1;";
    }
}
