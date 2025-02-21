<?php
namespace App\Services\Message\Strategies;

use App\Database\Database;
use App\Services\Message\Contracts\MessageStrategy;

class DatabaseMessageStrategy implements MessageStrategy {
	public function __construct( private Database $db ) {
	}

	public function send( string $recipient, string $subject, string $body ): bool {
		try {
			$data     = array(
				'recipient' => $recipient,
				'subject'   => $subject,
				'body'      => $body,
			);
			$response = $this->db->insert( 'messages', $data );

			return $response;
		} catch ( \Exception $e ) {
			logDebug( 'Failed to store message in database: ' . $e->getMessage() );
			return false;
		}
	}
}
