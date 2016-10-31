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
                    <input type="file" name="data"/>
                    <button class="btn btn-primary">Submit</button>

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
