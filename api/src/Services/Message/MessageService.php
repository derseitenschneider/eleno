<?php

namespace App\Services\Message;

use App\Services\Message\Strategies\DatabaseMessageStrategy;

class MessageService {
	public function __construct( private string $strategy, private DatabaseMessageStrategy $dbStrategy ) {
	}

	public function send( string $recipient, string $subject, string $body ) {
		return match ( $this->strategy ) {
			'database' => $this->dbStrategy->send( $recipient, $subject, $body ),
			// 'email' => $this->emailStrategy->send( $recipient, $header, $body ),
			default=> throw new \InvalidArgumentException( "Unknown strategy: {$this->strategy}" )
		};
	}
}
