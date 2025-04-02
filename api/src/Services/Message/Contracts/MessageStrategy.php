<?php
namespace App\Services\Message\Contracts;

interface MessageStrategy {
	/**
	 * Send
	 *
	 * Send the message.
	 *
	 * @param string $recipient
	 * @param string $subject
	 * @param string $body
	 */
	public function send(
		string $recipient,
		string $subject,
		string $body
	): bool;
}
