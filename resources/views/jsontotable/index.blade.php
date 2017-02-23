@extends('shared.master')

@section('content')
    <section class="content-header">
        <h1>
            <b>JSON TO TABLE</b>
        </h1>
    </section>

    <!-- Main content -->
    <section class="content">
        <?php if(!empty(Request::input('error'))){ ?>
            <div class="alert alert-danger">
                {{ Request::input('error') }}
            </div>
        <?php } ?>
        
        <div class="box">
            <div class="box-body">
                <form method="post" class="form">
                    <div class="form-group">
                        <label class="control-label">Table</label>
                        <input type="text" class="form-control" name="table"/>
                    </div>
                    <div class="form-group">
                        <label class="control-label">JSON</label>
                        <textarea name="json" class="form-control" rows="10"></textarea>
                    </div>
                    <button class="btn btn-primary">Submit</button>
                    {!! csrf_field() !!}
                </form>
            </div>
        </div>
    </section>
@overwrite
