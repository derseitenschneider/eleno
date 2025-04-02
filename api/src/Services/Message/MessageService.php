<?php

namespace App\Services\Message;

use App\Services\Message\Strategies\DatabaseMessageStrategy;
use InvalidArgumentException;

class MessageService {

	/**
	 * Construct
	 *
	 * The class constructor.
	 *
	 * @param array $strategies
	 * @return void
	 */
	public function __construct( private readonly array $strategies ) {
	}

	/**
	 * Send
	 *
	 * Sends message based on given strategy.
	 *
	 * @param string $recipient
	 * @param string $subject
	 * @param string $body
	 * @param string $strategy
	 *
	 * @throws InvalidArgumentException Throws when defined strategy does not exist.
	 */
	public function send(
		string $recipient,
		string $subject,
		string $body,
		string $strategy = 'database',
	) {
		if ( ! isset( $this->strategies[ $strategy ] ) ) {
			throw new InvalidArgumentException( "Unknown strategy: {$strategy}" );
		}
		return $this->strategies[ $strategy ]->send( $recipient, $subject, $body );
	}
}
