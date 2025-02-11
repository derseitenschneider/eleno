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

		switch ( $level ) {
			case 1:
				$template = $this->templateService->getTemplate( 'subscription_payment_failed_1' );
				break;
			case 2:
				$template = $this->templateService->getTemplate( 'subscription_payment_failed_2' );
				break;
			case 3:
				$template = $this->templateService->getTemplate( 'subscription_payment_failed_3' );
				break;

			default:
				$template = $this->templateService->getTemplate( 'subscription_payment_failed_1' );
		}

		$template = $this->templateService->fillTemplate( $template, $data );

		$this->messageService->send(
			recipient:$userId,
			subject:$template->subject,
			body:$template->body
		);
	}
}
