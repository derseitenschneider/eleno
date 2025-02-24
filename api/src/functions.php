<?php
namespace {

	function dd( string $var ): void {
		echo '<pre>';
		var_dump( $var );
		echo '</pre>';
	}

	function _log( $variable, $level, $log_file = 'application.log' ): void {
		$file_handle = fopen( $log_file, 'a' );
		if ( false === $file_handle ) {
			throw new Exception( "Unable to open log file: $log_file" );
		}

		$time_stamp = date( 'Y-m-d H:i:s' );
		$type       = gettype( $variable );
		$backtrace  = debug_backtrace( DEBUG_BACKTRACE_IGNORE_ARGS, 1 )[0];
		$location   = $backtrace['file'] . ':' . $backtrace['line'];

		$colors = array(
			'DEBUG' => "\033[0;34m",  // Blue
			'INFO'  => "\033[0;32m",   // Green
			'ERROR' => "\033[0;31m",  // Red
			'RESET' => "\033[0m",      // Reset
		);

		$color       = $colors[ $level ] ?? $colors['DEBUG'];
		$log_message = "{$color}[{$time_stamp}] [{$level}] [Type: {$type}] [{$location}]\n";

		switch ( $type ) {
			case 'array':
			case 'object':
				$log_message .= json_encode( $variable, JSON_PRETTY_PRINT ) . "\n";
				break;
			case 'resource':
				$log_message .= 'Resource ID:' . intval( $variable ) . "\n";
				break;
			case 'boolean':
				$log_message .= ( $variable ? 'true' : 'false' ) . "\n";
				break;
			case 'NULL':
				$log_message .= "NULL\n";
				break;
			default:
				$log_message .= var_export( $variable, true ) . "\n";
		}

		$log_message .= $colors['RESET'] . "\n";  // Reset color at the end
		fwrite( $file_handle, $log_message );
		fclose( $file_handle );
	}

	function logInfo( $variable, $log_file = 'application.log' ) {
		_log( $variable, 'INFO', $log_file );
	}

	function logDebug( $variable, $log_file = 'application.log' ) {
		_log( $variable, 'DEBUG', $log_file );
	}

	function logErrors( $variable, $log_file = 'application.log' ) {
		_log( $variable, 'ERROR', $log_file );
	}
}
