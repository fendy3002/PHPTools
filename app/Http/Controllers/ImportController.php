<?php

namespace App\Http\Controllers;

use App\User;
use App\Http\Controllers\Controller;

class ImportController extends Controller
{
    public function getIndex()
    {
        return view('import.index');
    }
    public function postIndex(){
        $uuid = \QzPhp\Q::Z()->uuid();

        $uploaded = \Request::file('data');
        $uploadPath = $uploaded->getPathName();

        \Excel::load($uploadPath, function($reader) use($uuid) {
            $dataModel = (object)[
                'currentRow' => 1,
                'limit' => 1000,
                'buffer' => [],
                'uuid' => $uuid,
                'title' => '',
                'tableName' => ''
            ];

            $reader->each(function($sheet) use($dataModel){
                $db = \DB::connection('');
                $dataModel->title = $sheet->getTitle();

                $columns = \QzPhp\Q::Z()->enum($sheet->first()->keys()->all())->select(function($k){
                    return '`' . $this->formatName($k) . '` varchar(1000)';
                })->result();
                $column = implode(', ', $columns);
                $tableName = $this->formatName($dataModel->title) . '_' . $dataModel->uuid;
                $dataModel->tableName = $tableName;
                $query = "create table " . $tableName . ' ('. $column .')';
                $db->statement($query);

                $sheet->each(function($row) use($dataModel){
                    $dataModel->buffer[] = $row->toArray();
                    if($dataModel->currentRow == $dataModel->limit){
                        $db->table($dataModel->tableName)->insert($dataModel->buffer);
                        $dataModel->currentRow = 1;
                        $dataModel->buffer = [];
                    }
                });

                $db->table($dataModel->tableName)->insert($dataModel->buffer);
                $dataModel->currentRow = 1;
                $dataModel->buffer = [];
            });
        });
        
        return view('import.index');
    }
    private function formatValue($value){
        if($value == 'NULL') {
            dd($value);
        }
    }
    private function formatName($name){
        $from = ['.', ' ', '-', '!', '@', '#', '$'];
        $with = ['', '', '', '', '', '', ''];
        return str_replace($from, $with, $name);
    }
}
