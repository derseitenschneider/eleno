<?php
namespace App\Services\Message\Strategies;

use App\Database\Database;
use App\Services\Message\Contracts\MessageStrategy;
use Monolog\Logger;

class MailMessageStrategy implements MessageStrategy {
	public function __construct( private Database $db, private Logger $logger ) {
	}

	public function send( string $recipient, string $subject, string $body ): bool {
		try {
			$response = mail( to: 'brian.boy@gmx.ch', subject:'test', message:'test' );

			return $response;
		} catch ( \Exception $e ) {
			$this->logger->error(
				'Failed to store message in database: ' . $e->getMessage()
			);
			return false;
		}
	}
}
