<?php

namespace App\Services\Message\Handlers;

use App\Services\Message\MessageService;
use App\Services\Message\Strategies\DatabaseMessageStrategy;
use App\Services\Message\Templates\MessageTemplateService;
use App\Services\Stripe\DTO\StripeCheckoutCompletedDTO;
use App\Services\Stripe\StripeAPIService;
use InvalidArgumentException;

class PaymentFailedMessageHandler {

	/**
	 * Construct
	 *
	 * The class constructor.
	 *
	 * @param MessageTemplateService $templateService
	 * @param MessageService         $messageService
	 */
	public function __construct(
		private MessageTemplateService $templateService,
		private MessageService $messageService,
	) {
	}

	/**
	 * Handle
	 *
	 * Handles getting the template, filling it and sending the message.
	 *
	 * @param int    $level
	 * @param string $userId
	 * @param string $firstName
	 */
	public function handle( int $level, string $userId, string $firstName ) {

		$data = array(
			'{{userName}}' => $firstName,
			'{{year}}'     => date( 'Y' ),
		);

		$template = $this->templateService->getTemplate( "subscription_payment_failed_{$level}" );
		$template = $this->templateService->fillTemplate( $template, $data );

		$this->messageService->send(
			recipient:$userId,
			subject:$template->subject,
			body:$template->body
		);
	}
}
