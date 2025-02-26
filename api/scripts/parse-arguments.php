<?php

function parseArguments( $argv ) {
	$arguments = [];
	foreach ( $argv as $arg ) {
		if ( substr( $arg, 0, 2 ) == '--' ) {
			$parts              = explode( '=', substr( $arg, 2 ), 2 );
			$name               = $parts[0];
			$value              = isset( $parts[1] ) ? $parts[1] : true; // If no value, assume true
			$arguments[ $name ] = $value;
		}
	}
	return $arguments;
}
