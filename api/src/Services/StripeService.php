<?php
namespace App\Services;

use App\Config\Config;
use App\Core\Http;
use App\Services\Message\Handlers\CancellationMessageHandler;
use App\Services\Message\Handlers\ReactivationMessageHandler;
use App\Services\Security\StripeSecurityChecks;
use App\Services\Stripe\StripeAPIService;
use App\Services\Stripe\WebhookHandler;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Stripe\Webhook;

class StripeService {

	public function __construct(
		private Config $config,
		private StripeAPIService $stripeAPI,
		private StripeSecurityChecks $securityChecks,
		private WebhookHandler $webhookHandler,
		private CancellationMessageHandler $cancellationMessageHandler,
		private ReactivationMessageHandler $reactivationMessageHandler,
	) {
	}


	public function getInvoice( Request $request, Response $response ) {
		$body      = $request->getParsedBody();
		$invoiceId = $body ['invoiceId'];

		try {
			$invoiceUrl = $this->stripeAPI->getInvoiceUrl( $invoiceId );
			$data       = array(
				'status' => 'success',
				'data'   => array(
					'invoiceUrl' => $invoiceUrl,
				),
			);

			return Http::jsonResponse( $response, $data );
		} catch ( \Exception $e ) {
			return Http::errorResponse( $response, $e->getMessage(), $e->getCode() );
		}
	}

	public function cancelAllSubscriptions( Request $request, Response $response ) {
		$body       = $request->getParsedBody();
		$customerId = $body['customer_id'];
		$this->stripeAPI->cancelAllSubscriptions( $customerId );
	}

	public function deleteCustomer( Request $request, Response $response, $args ) {
		$customerId = $args['customer_id'] ?? '';
		try {
			if ( ! $this->securityChecks
				->verifyCustomerAccess(
					$customerId,
					$this->securityChecks->getUserIdFromRequest( $request )
				) ) {
				return Http::errorResponse( $response, 'Unauthorized access', 403 );
			}

				$this->stripeAPI->cancelAllSubscriptions( $customerId );
				$this->stripeAPI->deleteCustomer( $customerId );

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

	public function createPaymentSession( Request $request, Response $response ) {
		$body             = $request->getParsedBody();
		$priceId          = $body['price_id'];
		$mode             = $body['mode'];
		$userId           = $body['user_id'];
		$stripeCustomerId = $body['stripe_customer_id'];
		$locale           = $body['locale'];
		$currency         = $body['currency'];

		try {
			if ( ! $this->securityChecks->verifyCustomerAccess( $stripeCustomerId, $userId ) ) {
				return Http::errorResponse( $response, 'Unauthorized access', 403 );
			}

			$data = $this->stripeAPI->createSesssion(
				userId: $userId,
				stripeCustomerId: $stripeCustomerId,
				priceId: $priceId,
				mode: $mode,
				locale: $locale,
				currency: $currency
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

	public function customerPortal( Request $request, Response $response, $args ) {
		$customer_id = $args['customer_id'];
		$body        = $request->getParsedBody();
		$user_locale = $body['locale'] ?? '';

		try {
			if ( ! $this->securityChecks->verifyCustomerAccess(
				$customer_id,
				$this->securityChecks->getUserIdFromRequest( $request )
			) ) {
				return Http::errorResponse( $response, 'Unauthorized access', 403 );
			}

			$data = $this->stripeAPI->createCustomerPortal( $customer_id, $user_locale );
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

	public function cancelAtPeriodEnd( Request $request, Response $response, $args ) {
		$subscription_id = $args['subscription_id'];
		$body            = $request->getParsedBody();
		$firstName       = $body['firstName'] ?? '';
		$userId          = $body['userId'] ?? '';

		try {
			if ( ! $this->securityChecks->verifySubscriptionAccess(
				subscriptionId: $subscription_id,
				userId: $this->securityChecks->getUserIdFromRequest( $request )
			) ) {
				return Http::errorResponse( $response, 'Unauthorized access', 403 );
			}

			$this->stripeAPI->updateSubscription(
				$subscription_id,
				array( 'cancel_at_period_end' => true )
			);

			$this->cancellationMessageHandler->handle(
				userId: $userId,
				firstName:$firstName
			);

			return Http::jsonResponse(
				$response,
				array(
					'status' => 'success',
					'data'   => null,
				)
			);

		} catch ( \Exception $e ) {
			return Http::errorResponse( $response, $e->getMessage() );
		}
	}

	public function handleReactivation( Request $request, Response $response, $args ) {
		$subscription_id = $args['subscription_id'];
		$body            = $request->getParsedBody();
		$userId          = $body['userId'];
		$firstName       = $body['firstName'];

		try {
			if ( ! $this->securityChecks->verifySubscriptionAccess(
				$subscription_id,
				$this->securityChecks->getUserIdFromRequest( $request )
			) ) {
				return Http::errorResponse( $response, 'Unauthorized access', 403 );
			}

			$this->stripeAPI->updateSubscription(
				$subscription_id,
				array( 'cancel_at_period_end' => false )
			);

			$this->reactivationMessageHandler->handle(
				userId: $userId,
				firstName: $firstName
			);

			return Http::jsonResponse(
				$response,
				array(
					'status' => 'success',
					'data'   => null,
				)
			);

		} catch ( \Exception $e ) {
			return Http::errorResponse( $response, $e->getMessage() );
		}
	}

	public function handleWebhook( Request $request, Response $response ) {
		$webhookSecret = $this->config->stripeWebhookSignature;

		$payload   = @file_get_contents( 'php://input' );
		$sigHeader = $_SERVER['HTTP_STRIPE_SIGNATURE'];
		$event     = null;

		try {
			$event = Webhook::constructEvent( $payload, $sigHeader, $webhookSecret );

			$this->webhookHandler->handleEvent( $event );

			return $response->withStatus( 200 );

		} catch ( \UnexpectedValueException $e ) {

			return Http::errorResponse( $response, $e->getMessage(), 400 );

		} catch ( \Stripe\Exception\SignatureVerificationException $e ) {
			return Http::errorResponse(
				$response,
				'Error verifying webhook signature: ' . $e->getMessage()
			);
			exit();
		}
	}
}
