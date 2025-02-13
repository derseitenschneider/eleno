<?php

namespace App\Services\Message\Handlers;

use App\Services\Message\MessageService;
use App\Services\Message\Strategies\DatabaseMessageStrategy;
use App\Services\Message\Templates\MessageTemplateService;
use App\Services\Stripe\DTO\StripeCheckoutCompletedDTO;
use App\Services\Stripe\StripeAPIService;
use App\Services\SupabaseService;

class LifetimeUpgradeHandler {

	public function __construct(
		private DatabaseMessageStrategy $databaseMessageStrategy,
		private MessageTemplateService $templateService,
		private MessageService $messageService,
		private StripeAPIService $stripeApiService,
		private SupabaseService $supabase
	) {
	}

	public function handle( StripeCheckoutCompletedDTO $checkoutDTO ) {
		$invoiceUrl = $this->stripeApiService->getInvoiceUrl( $checkoutDTO->invoiceId );
		$firstName  = $this->supabase->get(
			'profiles',
			array(
				'select' => 'first_name',
				'id'     => 'eq.' . $checkoutDTO->userId,
			)
		) ?? '';

		$data = array(
			'{{planName}}'     => 'Lifetime',
			'{{customerName}}' => $firstName['data'][0]['first_name'],
			'{{invoiceUrl}}'   => $invoiceUrl . "&locale=$checkoutDTO->locale",
		);

		$template = $this->templateService->getTemplate( 'lifetime_upgrade' );
		$template = $this->templateService->fillTemplate( $template, $data );

		$this->messageService->send( $checkoutDTO->userId, $template->subject, $template->body );
	}
}
