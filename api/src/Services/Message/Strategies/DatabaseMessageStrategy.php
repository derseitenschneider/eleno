<?php
namespace App\Services\Message\Strategies;

use App\Services\Message\Contracts\MessageStrategy;
use App\Services\SupabaseService;

class DatabaseMessageStrategy implements MessageStrategy {
	public function __construct( private SupabaseService $supabase ) {
	}

	public function send( string $recipient, string $subject, string $body ): bool {
		try {
			$data = $this->supabase->insert(
				'messages',
				array(
					'recipient' => $recipient,
					'subject'   => $subject,
					'body'      => $body,
				)
			);
			if ( $data['success'] === true ) {
				return true;
			} else {
				return false;
			}
		} catch ( \Exception $e ) {
			logDebug( 'Failed to store message in database: ' . $e->getMessage() );
			return false;
		}
	}
}
