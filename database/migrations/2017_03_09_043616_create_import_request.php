<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateImportRequest extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('import_request', function (Blueprint $table) {
            $table->increments('id');
            $table->char('uuid', 32);
            $table->string('file_name', 100);
            $table->text('schema');
            $table->dateTime('utc_created');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('import_request');
    }
}
