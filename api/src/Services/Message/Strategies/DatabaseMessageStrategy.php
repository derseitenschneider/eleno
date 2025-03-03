<?php
namespace App\Services\Message\Strategies;

use App\Database\Database;
use App\Services\Message\Contracts\MessageStrategy;
use Monolog\Logger;

class DatabaseMessageStrategy implements MessageStrategy {
	public function __construct() {
	}

	public function send( string $recipient, string $subject, string $body ): bool {
		try {

		} catch ( \Exception $e ) {
			return false;
		}
	}
}
