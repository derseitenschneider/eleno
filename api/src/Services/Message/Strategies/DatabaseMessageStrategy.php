<?php
namespace App\Services\Message\Strategies;

use App\Database\Database;
use App\Services\Message\Contracts\MessageStrategy;
use Monolog\Logger;

class DatabaseMessageStrategy implements MessageStrategy {
	/**
	 * Construct
	 *
	 * The class constructor.
	 *
	 * @param Database $db
	 * @param Logger   $logger
	 */
	public function __construct( private Database $db, private Logger $logger ) { }

	/**
	 * Send
	 *
	 * Sends the message by making a new database entry.
	 *
	 * @param string $recipient
	 * @param string $subject
	 * @param string $body
	 */
	public function send( string $recipient, string $subject, string $body ): bool {
		try {
			$data = array(
				'recipient' => $recipient,
				'subject'   => $subject,
				'body'      => $body,
			);

			$response = $this->db->insert( 'messages', $data );

			$this->logger->info( 'Database Message sent', [ 'data' => $data ] );

			return $response;
		} catch ( \Exception $e ) {
			$message = $e->getMessage();
			$this->logger->error( 'Failed to store message in database: ' . $message );
			return false;
		}
	}
}
