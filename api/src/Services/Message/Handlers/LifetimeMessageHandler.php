<?php

namespace App\Services\Message\Handlers;

use App\Database\Database;
use App\Services\Message\MessageService;
use App\Services\Message\Strategies\DatabaseMessageStrategy;
use App\Services\Message\Templates\MessageTemplateService;
use App\Services\Stripe\DTO\StripeCheckoutCompletedDTO;
use App\Services\Stripe\StripeAPIService;
use Stripe\Exception\ApiErrorException;
use InvalidArgumentException;

class LifetimeMessageHandler {

	/**
	 * Construct
	 *
	 * The class constructor.
	 *
	 * @param MessageTemplateService $templateService
	 * @param MessageService         $messageService
	 * @param StripeAPIService       $stripeApiService
	 * @param Database               $db
	 */
	public function __construct(
		private MessageTemplateService $templateService,
		private MessageService $messageService,
		private StripeAPIService $stripeApiService,
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
		$invoiceId  = $checkoutDTO->invoiceId;
		$invoiceUrl = $this->stripeApiService->getInvoiceUrl( $invoiceId );

		$sql = <<<SQL
		SELECT first_name
		FROM profiles
		WHERE id = $1
		SQL;

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
