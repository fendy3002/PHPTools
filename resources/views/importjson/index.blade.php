@extends('shared.master')

@section('content')
    <section class="content-header">
        <h1>
            <b>IMPORT</b>
        </h1>
    </section>

    <!-- Main content -->
    <section class="content">
        <div class="box">
            <div class="box-body">
                <form method="post" enctype="multipart/form-data">
                    <div class="form-group">
                        <label class="control-label">File</label>
                        <input type="file" name="data"/>
                    </div>
                    <div class="form-group">
                        <label class="control-label">Struct</label>
                        <textarea class="form-control" rows=20 name="struct"></textarea>
                    </div>
                    <div class="form-group">
                        <button class="btn btn-primary">Submit</button>
                    </div>

                    {!! csrf_field() !!}
                </form>
            </div>
        </div>
        <?php if(!empty($results) && count($results) > 0){
        ?>
            <div class="box box-solid">
                <div class="box-body">
                    <ul>
                        <?php foreach($results as $each){ ?>
                            <li>{{$each}}</li>
                        <?php } ?>
                    </ul>
                </div>
            </div>
        <?php } ?>

    </section>
@overwrite
