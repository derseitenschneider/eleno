<?php

namespace App\Controllers;

use App\Config\Config;
use App\Core\Http;
use App\Services\Security\StripeSecurityChecks;
use App\Services\Stripe\DTO\CheckoutSessionDTO;
use App\Services\Stripe\DTO\StripeSessionDTO;
use App\Services\Stripe\StripeAPIService;
use App\Services\StripeService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class StripeController {
	public function __construct(
		private StripeService $stripeService,
		private StripeSecurityChecks $securityChecks,
		private Config $config,
	) {
	}

	public function createCheckoutSession( Request $request, Response $response ) {
		try {
			$body             = $request->getParsedBody();
			$priceId          = $body['price_id'];
			$mode             = $body['mode'];
			$userId           = $body['user_id'];
			$stripeCustomerId = $body['stripe_customer_id'];
			$locale           = $body['locale'];
			$currency         = $body['currency'];
			$baseUrl          = $this->config->appBaseUrl;
			$cancelUrl        = "{$baseUrl}/settings/subscription";
			$succesUrl        = "{$baseUrl}/settings/subscription?session_type={$mode}&success=true";

			$sessionDTO = CheckoutSessionDTO::create(
				userId: $userId,
				priceId:$priceId,
				stripeCustomerId:$stripeCustomerId,
				mode:$mode,
				locale:$locale,
				currency:$currency,
				cancelUrl:$cancelUrl,
				succesUrl:$succesUrl
			);

			$accessCheck = $this->checkAccess(
				request:$request,
				response:$response,
				customerId:$stripeCustomerId
			);
			if ( $accessCheck !== null ) {
				return $accessCheck;
			}

			$data = $this->stripeService->createCheckoutSession( $sessionDTO );

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

	public function deleteCustomer( Request $request, Response $response, $args ) {
		$customerId = $args['customer_id'] ?? '';
		try {
			$accessCheck = $this->checkAccess(
				request:$request,
				response:$response,
				customerId:$customerId
			);
			if ( $accessCheck !== null ) {
				return $accessCheck;
			}

				$this->stripeService->deleteCustomer( $customerId );

				return Http::jsonResponse(
					$response,
					array(
						'status' => 'success',
						'data'   => null,
					),
				);

		} catch ( \Exception $e ) {
			return Http::errorResponse( $response, $e->getMessage() );
		}
	}

	public function getInvoice( Request $request, Response $response ) {
		try {
			$invoiceId  = $request->getParsedBody()['invoiceId'];
			$invoiceUrl = $this->stripeService->getInvoice( $invoiceId );

			$accessCheck = $this->checkAccess(
				request:$request,
				response:$response,
				invoiceId:$invoiceId
			);
			if ( $accessCheck !== null ) {
				return $accessCheck;
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

			$accessCheck = $this->checkAccess(
				request:$request,
				response:$response,
				subscriptionId:$subscriptionId
			);
			if ( $accessCheck !== null ) {
				return $accessCheck;
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

			$accessCheck = $this->checkAccess(
				request:$request,
				response:$response,
				subscriptionId:$subscriptionId
			);
			if ( $accessCheck !== null ) {
				return $accessCheck;
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

			$accessCheck = $this->checkAccess(
				request:$request,
				response:$response,
				customerId:$customerId
			);
			if ( $accessCheck !== null ) {
				return $accessCheck;
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
	private function checkAccess(
		Request $request,
		Response $response,
		?string $customerId = null,
		?string $invoiceId = null,
		?string $subscriptionId = null
	): Response|null {
		$userId = $this->securityChecks->getUserIdFromRequest( $request );

		if ( $customerId && ! $this->securityChecks->verifyCustomerAccess( $customerId, $userId ) ) {
			return Http::errorResponse( $response, 'Unauthorized access', 403 );
		}

		if ( $invoiceId && ! $this->securityChecks->verifyInvoiceAccess( $invoiceId, $userId ) ) {
			return Http::errorResponse( $response, 'Unauthorized access', 403 );
		}

		if ( $subscriptionId && ! $this->securityChecks->verifySubscriptionAccess( $subscriptionId, $userId ) ) {
			return Http::errorResponse( $response, 'Unauthorized access', 403 );
		}

		return null; // Access granted
	}
}
