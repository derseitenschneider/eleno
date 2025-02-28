<?php

namespace App\Services\Message\Handlers;

use App\Database\Database;
use App\Services\Message\MessageService;
use App\Services\Message\Strategies\DatabaseMessageStrategy;
use App\Services\Message\Templates\MessageTemplateService;
use App\Services\Stripe\DTO\StripeCheckoutCompletedDTO;
use App\Services\Stripe\StripeAPIService;

class SubscriptionMessageHandler {

	public function __construct(
		private DatabaseMessageStrategy $databaseMessageStrategy,
		private MessageTemplateService $templateService,
		private MessageService $messageService,
		private Database $db
	) {
	}

	public function handle( StripeCheckoutCompletedDTO $checkoutDTO ) {
		$sql =
			'
            SELECT first_name
            FROM profiles
            WHERE id = $1
            ';

		$params = [ $checkoutDTO->userId ];
		$result = $this->db->query( $sql, $params ) ?? '';
		$data   = [
			'{{userName}}' => $result[0]['first_name'],
			'{{year}}'     => date( 'Y' ),
		];

		$template = $this->templateService->getTemplate( 'first_time_subscription' );
		$template = $this->templateService->fillTemplate( $template, $data );

		$this->messageService->send( $checkoutDTO->userId, $template->subject, $template->body );
	}
}
