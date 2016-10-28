<?php
    $gravatarUrl = 'http://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm';
    $user = (object)[
        'display_name' => 'USER',
        'created_at' => '2000-01-01'
    ];
?>
<!-- User Account: style can be found in dropdown.less -->
<li class="dropdown user user-menu">
    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
    <img src="{{ $gravatarUrl . '&fs=16' }}" class="user-image" alt="User Image">
    <span class="hidden-xs">{{ $user->display_name }}</span>
    </a>
    <ul class="dropdown-menu">
        <!-- User image -->
        <li class="user-header">
            <img src="{{ $gravatarUrl . '&fs=160' }}" class="img-circle" alt="User Image">
            <p>
                {{ $user->display_name }}
                <small>Member since {{ $user->created_at }}</small>
            </p>
        </li>
        <!-- Menu Body
        <li class="user-body">
            <div class="col-xs-4 text-center">
            </div>
            <div class="col-xs-4 text-center">

            </div>
            <div class="col-xs-4 text-center">
            </div>
        </li>-->
        <!-- Menu Footer-->
        <li class="user-footer">
            <div class="pull-left">
                <a href="{{ config('coco.auth_url') }}" target="_blank" class="btn btn-default btn-flat"><i class="fa fa-user"></i> Profile</a>
            </div>
            <div class="pull-right">
                <a href="{!! url('_/auth/logout') !!}" class="btn btn-default btn-flat"><i class="fa fa-sign-out"></i> Sign out</a>
            </div>
        </li>
    </ul>
</li>
