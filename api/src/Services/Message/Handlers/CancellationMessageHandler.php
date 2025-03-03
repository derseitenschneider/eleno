<?php

namespace App\Services\Message\Handlers;

use App\Services\Message\MessageService;
use App\Services\Message\Strategies\DatabaseMessageStrategy;
use App\Services\Message\Templates\MessageTemplateService;
use App\Services\Stripe\DTO\StripeCheckoutCompletedDTO;
use App\Services\Stripe\StripeAPIService;

class CancellationMessageHandler {

	public function __construct(
		private MessageTemplateService $templateService,
		private MessageService $messageService,
	) {
	}

	public function handle( string $userId, string $firstName ) {

		$data = array(
			'{{userName}}' => $firstName,
			'{{year}}'     => date( 'Y' ),
		);

		$template = $this->templateService->getTemplate( 'subscription_cancellation' );
		$template = $this->templateService->fillTemplate( $template, $data );

		$this->messageService->send(
			recipient:$userId,
			subject:$template->subject,
			body:$template->body
		);
	}
}
