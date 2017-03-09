<?php

namespace App\Jobs;

use App\Jobs\Job;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Bus\SelfHandling;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\DispatchesJobs;

class TextFileImportJob extends Job implements ShouldQueue
{
    use InteractsWithQueue, SerializesModels, DispatchesJobs;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($data)
    {
        $this->data = $data;
    }
    private $data;

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $uuid = $this->data["uuid"];
        $filepath = $this->data['filepath'];
        $offset = $this->data['offset'];
        $columns = $this->data['columns'];
        $delimiter = $this->data['delimiter'];
        $tableName = '_' . $uuid;
        $eachLoop = 100;

        \Log::debug($this->data);

        $db = \DB::connection("");

        $fileReader = new \QzPhp\FileReader();
        $readContent = $fileReader->readFileByLines($filepath, $offset, $eachLoop);

        if(empty($readContent->content)){
            return;
        }

        $lines = explode("\n", $readContent->content);
        $inserting = [];
        foreach($lines as $line){
            $insertLine = [];
            if(empty($line)){ continue; }
            $values = explode($delimiter, $line);
            for($i = 0; $i < count($values); $i++){
                $insertLine[$columns[$i]] = $values[$i];
            }
            $inserting[] = $insertLine;
        }

        $db->table($tableName)->insert($inserting);

        if(count($lines) <= $eachLoop){
            $this->dispatch(new TextFileImportJob([
                "uuid" => $uuid,
                "filepath" => $filepath,
                "offset" => $readContent->pos,
                "columns" => $columns,
                "delimiter" => $delimiter
            ]));
        }
    }
}
