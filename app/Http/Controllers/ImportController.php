<?php

namespace App\Http\Controllers;

use App\User;
use App\Http\Controllers\Controller;

class ImportController extends Controller
{
    public function getIndex()
    {
        return view('import.index', ['results' => []]);
    }
    public function postIndex(){
        set_time_limit(3600);
        $viewModel = (object)['results' => []];
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

        if(!empty($struct)){
            $convertedStruct = (array)json_decode($struct);
            $arrStruct = [];
            foreach($convertedStruct as $key => $value){
                $arrStruct[$this->formatName($key)] = $value;
            }
        }

        $moveFile = $movePath . $uuid;
        chmod($moveFile, 0777);

        \Excel::filter('chunk')->load($uploadPath)->chunk(1500, function($sheet) use($uuid, $viewModel, $arrStruct) {
            $dataModel = (object)[
                'currentRow' => 1,
                'limit' => 1000,
                'buffer' => [],
                'uuid' => $uuid,
                'title' => '',
                'tableName' => ''
            ];

            //$reader->each(function($sheet) use($dataModel){
                $db = \DB::connection('');

                $dataModel->title = $sheet->getTitle();
                echo "Sheet: {$dataModel->title} \n";
                $dataModel->tableName = $this->formatName($dataModel->title) . '_' . $dataModel->uuid;

                $exists = $db->select("SELECT table_name
                    FROM information_schema.tables
                    WHERE table_schema = DATABASE()
                        AND table_name = '" . $dataModel->tableName . "';");
                $exists = count($exists) == 1;

                if(!$exists){
                    echo $dataModel->tableName . " not exists\n";
                    $columns = NULL;
                    if(!empty($arrStruct)){
                        $columns = \QzPhp\Q::Z()->enum($sheet->first()->keys()->all())->select(
                            function($k) use($arrStruct){
                                if(empty($k) || $k == ''){ return ''; }
                                $field = 'varchar(1000)';
                                if(array_key_exists($this->formatName($k), $arrStruct)){
                                    $field = $arrStruct[$this->formatName($k)];
                                }
                                return '`' . $this->formatName($k) . '` ' . $field;
                            })->result();
                    }
                    else{
                        $columns = \QzPhp\Q::Z()->enum($sheet->first()->keys()->all())->select(
                            function($k){
                                if(empty($k) || $k == ''){ return ''; }
                                return '`' . $this->formatName($k) . '` varchar(1000)';
                            })->result();
                    }
                    
                    $column = implode(', ', $columns);

                    $query = "create table " . $dataModel->tableName . ' ('. $column .')';
                    $db->statement($query);
                }
                else{
                    echo $dataModel->tableName . " exists\n";
                }

                $sheet->each(function($row) use($dataModel){
                    $buffer = array_filter($row->toArray(), function($value) {
                        return !is_null($value) && $value !== '';
                    }, ARRAY_FILTER_USE_KEY);
                    if(count($buffer) == 0){ return; }

                    $dataModel->buffer[] = $buffer;
                });

                $db->table($dataModel->tableName)->insert($dataModel->buffer);
                echo "Count: " . count($dataModel->buffer) . " \n";
                $dataModel->currentRow = 1;
                $dataModel->buffer = [];
            //});
        });

        return view('import.index', (array)$viewModel);
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
