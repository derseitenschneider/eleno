<?php

namespace App\Services\Message\Handlers;

use App\Services\Message\MessageService;
use App\Services\Message\Strategies\DatabaseMessageStrategy;
use App\Services\Message\Templates\MessageTemplateService;
use App\Services\Stripe\DTO\StripeCheckoutCompletedDTO;
use App\Services\Stripe\StripeAPIService;
use App\Services\SupabaseService;

class FirstSubHandler {

	public function __construct(
		private DatabaseMessageStrategy $databaseMessageStrategy,
		private MessageTemplateService $templateService,
		private MessageService $messageService,
		private SupabaseService $supabase
	) {
	}

	public function handle( StripeCheckoutCompletedDTO $checkoutDTO ) {
		$firstName = $this->supabase->get(
			'profiles',
			array(
				'select' => 'first_name',
				'id'     => 'eq.' . $checkoutDTO->userId,
			)
		) ?? '';

		$data = array(
			'{{customerName}}' => $firstName['data'][0]['first_name'],
		);

		$template = $this->templateService->getTemplate( 'first_time_subscription' );
		$template = $this->templateService->fillTemplate( $template, $data );

		$this->messageService->send( $checkoutDTO->userId, $template->subject, $template->body );
	}
}
