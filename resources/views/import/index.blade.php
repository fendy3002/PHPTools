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
    </section>
@overwrite
