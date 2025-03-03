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
			$this->mailer->setFrom( 'info@eleno.net' );
			$this->mailer->addAddress( $recipient );
			$this->mailer->Subject  = $subject;
			$this->mailer->Body     = $body;
			$this->mailer->Priority = 1;

			$response = $this->mailer->send();

			return $response;
		} catch ( \Exception $e ) {
			logDebug( $e );
			return false;
		}
	}
}
