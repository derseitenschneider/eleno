<?php
namespace App\Services\Message\Strategies;

use App\Database\Database;
use App\Services\Message\Contracts\MessageStrategy;
use Monolog\Logger;

class DatabaseMessageStrategy implements MessageStrategy {
	public function __construct( private Database $db, private Logger $logger ) {
	}

	public function send( string $recipient, string $subject, string $body ): bool {
		try {
			$data     = array(
				'recipient' => $recipient,
				'subject'   => $subject,
				'body'      => $body,
			);
			$response = $this->db->insert( 'messages', $data );
			$this->logger->info(
				'Database Message sent',
				[ 'data' => $data ]
			);

			return $response;
		} catch ( \Exception $e ) {
			$this->logger->error(
				'Failed to store message in database: ' . $e->getMessage()
			);
			return false;
		}
	}
}
