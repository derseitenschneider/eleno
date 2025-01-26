<?php

namespace App\Services\Message;

use App\Services\Message\Strategies\DatabaseMessageStrategy;

class MessageService {
	public function __construct( private readonly array $strategies ) {
	}

	public function send( string $recipient, string $subject, string $body, string $strategy = 'database', ) {
		if ( ! isset( $this->strategies[ $strategy ] ) ) {
			throw new \InvalidArgumentException( "Unknown strategy: {$strategy}" );
		}
		return $this->strategies[ $strategy ]->send( $recipient, $subject, $body );
	}
}
