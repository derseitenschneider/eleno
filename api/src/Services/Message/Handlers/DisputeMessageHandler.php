<?php

namespace App\Services\Message\Handlers;

use App\Services\Message\MessageService;
use App\Services\Message\Strategies\DatabaseMessageStrategy;
use App\Services\Message\Strategies\MailMessageStrategy;
use App\Services\Message\Templates\MessageTemplateService;
use App\Services\Stripe\DTO\StripeCheckoutCompletedDTO;
use App\Services\Stripe\StripeAPIService;
use Stripe\Dispute;

class DisputeMessageHandler {

	public function __construct(
		private MessageService $messageService,
	) {
	}

	public function handle( Dispute $dispute ) {
		$recipient = 'brian.boy@gmx.ch';
		$subject   = 'A new dispute is pending';
		$body      = print_r( $dispute, true );

		$this->messageService->send(
			recipient:$recipient,
			subject:$subject,
			body:$body,
			strategy: 'mail'
		);
	}
}
