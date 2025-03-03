<?php

namespace App\Services\Message\Handlers;

use App\Services\Message\MessageService;
use App\Services\Message\Strategies\DatabaseMessageStrategy;
use App\Services\Message\Strategies\MailMessageStrategy;
use App\Services\Message\Templates\MessageTemplateService;
use App\Services\Stripe\DTO\StripeCheckoutCompletedDTO;
use App\Services\Stripe\StripeAPIService;

class DisputeMessageHandler {

	public function __construct(
		private MessageTemplateService $templateService,
		private MessageService $messageService,
	) {
	}

	public function handle( string $subject, string $recipient, string $body ) {
		$subject   = 'test';
		$recipient = 'test';
		$body      = 'test';

		$this->messageService->send(
			recipient:$recipient,
			subject:$subject,
			body:$body,
			strategy: 'mail'
		);
	}
}
