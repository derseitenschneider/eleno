<?php

namespace App\Controllers;

use App\Core\Http;
use App\Services\Security\StripeSecurityChecks;
use App\Services\StripeService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class StripeController {
	public function __construct(
		private StripeService $stripeService,
		private StripeSecurityChecks $securityChecks
	) {
	}

	public function getInvoice( Request $request, Response $response ) {
		try {
			$invoiceId  = $request->getParsedBody()['invoiceId'];
			$invoiceUrl = $this->stripeService->getInvoice( $invoiceId );

			if ( ! $this->securityChecks->verifyInvoiceAccess(
				$invoiceId,
				$this->securityChecks->getUserIdFromRequest( $request )
			) ) {
				return Http::errorResponse( $response, 'Unauthorized access', 403 );
			}

			$data = array(
				'status' => 'success',
				'data'   => array( 'invoiceUrl' => $invoiceUrl ),
			);

			return Http::jsonResponse( $response, $data );
		} catch ( \Exception $e ) {
			return Http::errorResponse( $response, $e->getMessage(), $e->getCode() );
		}
	}

	public function handleReactivation( Request $request, Response $response, $args ) {
		try {
			$subscriptionId = $args['subscription_id'];
			$body           = $request->getParsedBody();
			$userId         = $body['userId'];
			$firstName      = $body['firstName'];

			if ( ! $this->securityChecks->verifySubscriptionAccess(
				$subscriptionId,
				$this->securityChecks->getUserIdFromRequest( $request )
			) ) {
				return Http::errorResponse( $response, 'Unauthorized access', 403 );
			}

			$this->stripeService->handleReactivation(
				subscriptionId: $subscriptionId,
				userId: $userId,
				firstName: $firstName
			);

			return Http::jsonResponse( $response, );

		} catch ( \Exception $e ) {
			return Http::errorResponse( $response, $e->getMessage() );
		}
	}

	public function cancelAtPeriodEnd( Request $request, Response $response, $args ) {
		try {
			$subscriptionId = $args['subscription_id'];
			$body           = $request->getParsedBody();
			$firstName      = $body['firstName'] ?? '';
			$userId         = $body['userId'] ?? '';

			if ( ! $this->securityChecks->verifySubscriptionAccess(
				subscriptionId: $subscriptionId,
				userId: $this->securityChecks->getUserIdFromRequest( $request )
			) ) {
				return Http::errorResponse( $response, 'Unauthorized access', 403 );
			}

			$this->stripeService->cancelAtPeriodEnd(
				subscriptionId: $subscriptionId,
				userId: $userId,
				firstName: $firstName
			);

			return Http::jsonResponse( $response, );

		} catch ( \Exception $e ) {
			return Http::errorResponse( $response, $e->getMessage() );
		}
	}

	public function createCustomerPortal( Request $request, Response $response, $args ) {
		try {
			$customerId = $args['customer_id'];
			$body       = $request->getParsedBody();
			$userLocale = $body['locale'] ?? '';

			if ( ! $this->securityChecks->verifyCustomerAccess(
				$customerId,
				$this->securityChecks->getUserIdFromRequest( $request )
			) ) {
				return Http::errorResponse( $response, 'Unauthorized access', 403 );
			}

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
			return Http::errorResponse( $response, $e->getMessage() );
		}
	}
}
