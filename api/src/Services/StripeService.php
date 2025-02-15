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


	public function getInvoice( $invoiceId ) {
			return $this->stripeAPI->getInvoiceUrl( $invoiceId );
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

	public function createCustomerPortal( string $customerId, string $userLocale ) {
			return $this->stripeAPI->createCustomerPortal( $customerId, $userLocale );
	}

	public function cancelAtPeriodEnd(
		string $subscriptionId,
		string $userId,
		string $firstName
	) {
			$this->stripeAPI->updateSubscription(
				$subscriptionId,
				array( 'cancel_at_period_end' => true )
			);

			$this->cancellationMessageHandler->handle(
				userId: $userId,
				firstName:$firstName
			);
	}

	public function handleReactivation(
		string $subscriptionId,
		string $userId,
		string $firstName
	) {
			$this->stripeAPI->updateSubscription(
				$subscriptionId,
				array( 'cancel_at_period_end' => false )
			);

			$this->reactivationMessageHandler->handle(
				userId: $userId,
				firstName: $firstName
			);
	}
}
