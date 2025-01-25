<?php
namespace App\Services\Message\Contracts;

interface MessageStrategy {
	public function send( string $recipient, string $header, string $body ): bool;
}
