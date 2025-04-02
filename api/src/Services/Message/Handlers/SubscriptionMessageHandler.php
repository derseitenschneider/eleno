<?php

namespace App\Services\Message\Handlers;

use App\Database\Database;
use App\Services\Message\MessageService;
use App\Services\Message\Strategies\DatabaseMessageStrategy;
use App\Services\Message\Templates\MessageTemplateService;
use App\Services\Stripe\DTO\StripeCheckoutCompletedDTO;
use App\Services\Stripe\StripeAPIService;
use InvalidArgumentException;

class SubscriptionMessageHandler {

	/**
	 * Construct
	 *
	 * The class constructor.
	 *
	 * @param MessageTemplateService $templateService
	 * @param MessageService         $messageService
	 * @param Database               $db
	 */
	public function __construct(
		private MessageTemplateService $templateService,
		private MessageService $messageService,
		private Database $db
	) {
	}

	/**
	 * Handle
	 *
	 * Handles getting the template, filling it and sending the message.
	 *
	 * @param StripeCheckoutCompletedDTO $checkoutDTO
	 */
	public function handle( StripeCheckoutCompletedDTO $checkoutDTO ) {
		$sql = <<<SQL
		SELECT first_name
		FROM profiles
		WHERE id = $1
		SQL;

		$params = [ $checkoutDTO->userId ];
		$result = $this->db->query( $sql, $params );
		$data   = [
			'{{userName}}' => $result[0]['first_name'],
			'{{year}}'     => date( 'Y' ),
		];

		$template = $this->templateService->getTemplate( 'first_time_subscription' );
		$template = $this->templateService->fillTemplate( $template, $data );

		$userId  = $checkoutDTO->userId;
		$subject = $template->subject;
		$body    = $template->body;

		$this->messageService->send( recipient:$userId, subject:$subject, body:$body );
	}
}
