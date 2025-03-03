<?php

use DI\Container;
use App\Config\Config;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

return function ( Container $container ) {
	$container->set(
		'customMailer',
		function ( $container ) {
			/** @var Config $config */
			$config          = $container->get( Config::class );
			$mail            = new PHPMailer( true );
			$mail->SMTPDebug = SMTP::DEBUG_SERVER;
			$mail->isSMTP();
			$mail->Host       = $config->smtpHost;
			$mail->SMTPAuth   = true;
			$mail->Username   = $config->smtpUsername;
			$mail->Password   = $config->smtpPassword;
			$mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
			$mail->Port       = 587;
			return $mail;
		}
	);
};
