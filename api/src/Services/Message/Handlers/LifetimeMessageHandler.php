<?php

namespace App\Services\Message\Handlers;

use App\Database\Database;
use App\Services\Message\MessageService;
use App\Services\Message\Strategies\DatabaseMessageStrategy;
use App\Services\Message\Templates\MessageTemplateService;
use App\Services\Stripe\DTO\StripeCheckoutCompletedDTO;
use App\Services\Stripe\StripeAPIService;

class LifetimeMessageHandler {

	public function __construct(
		private MessageTemplateService $templateService,
		private MessageService $messageService,
		private StripeAPIService $stripeApiService,
		private Database $db
	) {
	}

	public function handle( StripeCheckoutCompletedDTO $checkoutDTO ) {
		$invoiceUrl = $this->stripeApiService->getInvoiceUrl( $checkoutDTO->invoiceId );
		$sql        =
			'
            SELECT first_name
            FROM profiles
            WHERE id = $1
            ';

		$params    = [ $checkoutDTO->userId ];
		$firstName = $this->db->query( $sql, $params );

		$data = array(
			'{{planName}}'   => 'Lifetime',
			'{{userName}}'   => $firstName[0]['first_name'],
			'{{year}}'       => date( 'Y' ),
			'{{invoiceUrl}}' => $invoiceUrl . "&locale=$checkoutDTO->locale",
		);

		$template = $this->templateService->getTemplate( 'lifetime_upgrade' );
		$template = $this->templateService->fillTemplate( $template, $data );

		$this->messageService->send( $checkoutDTO->userId, $template->subject, $template->body );
	}
}
