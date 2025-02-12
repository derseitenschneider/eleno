<?php

namespace App\Services\Message\Handlers;

use App\Services\Message\MessageService;
use App\Services\Message\Strategies\DatabaseMessageStrategy;
use App\Services\Message\Templates\MessageTemplateService;
use App\Services\Stripe\DTO\StripeCheckoutCompletedDTO;
use App\Services\Stripe\StripeAPIService;
use App\Services\SupabaseService;

class PaymentFailedMessageHandler {

	public function __construct(
		private DatabaseMessageStrategy $databaseMessageStrategy,
		private MessageTemplateService $templateService,
		private MessageService $messageService,
	) {
	}

	public function handle( int $level, string $userId, string $firstName ) {

		$data = array(
			'{{customerName}}' => $firstName,
		);

		$template = $this->templateService->getTemplate( "subscription_payment_failes_{$level}" );
		$template = $this->templateService->fillTemplate( $template, $data );

		$this->messageService->send(
			recipient:$userId,
			subject:$template->subject,
			body:$template->body
		);
	}
}
