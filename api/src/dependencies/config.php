<?php

use DI\Container;
use App\Config\Config;

return function ( Container $container ) {
	$container->set( Config::class, new Config() );
};
