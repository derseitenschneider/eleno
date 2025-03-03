<?php
namespace App\Services\Message\Strategies;

use App\Database\Database;
use App\Services\Message\Contracts\MessageStrategy;
use Monolog\Logger;
use PHPMailer\PHPMailer\PHPMailer;

class MailMessageStrategy implements MessageStrategy {
	public function __construct( private PHPMailer $mailer ) {
	}

	public function send( string $recipient, string $subject, string $body ): bool {
		try {
			// logDebug( $this->mailer );
			$this->mailer->setFrom( 'info@eleno.net', 'Brian von Eleno' );
			$this->mailer->addAddress( 'brian.boy@gmx.ch' );
			$this->mailer->Subject = 'This is a test';
			$this->mailer->Body    = 'Hello from testing';

			$response = $this->mailer->send();

			return $response;
		} catch ( \Exception $e ) {
			logDebug( $e );
			return false;
		}
	}
}
