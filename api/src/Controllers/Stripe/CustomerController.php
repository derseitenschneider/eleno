<?php

namespace App\Controllers\Stripe;

use App\Core\Http;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Services\StripeService;
use Monolog\Logger;

class CustomerController {
	public function __construct(
		private StripeService $stripeService,
		private Logger $logger
	) {
	}

	public function createPortal( Request $request, Response $response, $args ) {
		try {
			$customerId = $args['customer_id'];
			$body       = $request->getParsedBody();
			$userLocale = $body['locale'] ?? '';

			$data = $this->stripeService->createCustomerPortal(
				customerId: $customerId,
				userLocale: $userLocale
			);

			return Http::jsonResponse(
				$response,
				array(
					'status' => 'success',
					'data'   => $data,
				)
			);

		} catch ( \Exception $e ) {
			$this->logger->error( 'Create Portal error: ' . $e->getMessage() );
			return Http::errorResponse( $response, $e->getMessage() );
		}
	}

	public function getInvoiceUrlUrl( Request $request, Response $response ) {
		try {
			$invoiceId  = $request->getParsedBody()['invoiceId'];
			$invoiceUrl = $this->stripeService->getInvoiceUrl( $invoiceId );

			$data = array(
				'status' => 'success',
				'data'   => array( 'invoiceUrl' => $invoiceUrl ),
			);

			return Http::jsonResponse( $response, $data );
		} catch ( \Exception $e ) {
			$this->logger->error( 'Get Invoice error: ' . $e->getMessage() );
			return Http::errorResponse( $response, $e->getMessage(), $e->getCode() );
		}
	}

	public function deleteCustomer( Request $request, Response $response, $args ) {
		try {
			$customerId = $args['customer_id'] ?? '';

				$this->stripeService->deleteCustomer( $customerId );

				return Http::jsonResponse(
					$response,
					array(
						'status' => 'success',
						'data'   => null,
					),
				);

		} catch ( \Exception $e ) {
			$this->logger->error( 'Delete customer error: ' . $e->getMessage() );
			return Http::errorResponse( $response, $e->getMessage() );
		}
	}
}
