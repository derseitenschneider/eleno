<?php
namespace App\Services;

use App\Config\Config;
use App\Core\Http;
use App\Services\Message\Handlers\CancellationMessageHandler;
use App\Services\Message\Handlers\PaymentFailedMessageHandler;
use App\Services\Message\Handlers\ReactivationMessageHandler;
use App\Services\Security\StripeSecurityChecks;
use App\Services\Stripe\StripeAPIService;
use App\Services\Stripe\StripeRepository;
use App\Services\Stripe\WebhookHandler;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Stripe\Checkout\Session;
use Stripe\Stripe;
use Stripe\Event;
use Stripe\StripeClient;
use Stripe\Webhook;

class StripeService {

	public function __construct(
		private Config $config,
		private SupabaseService $supabase,
		private StripeAPIService $stripeAPI,
		private StripeRepository $repository,
		private StripeSecurityChecks $securityChecks,
		private WebhookHandler $webhookHandler,
		private CancellationMessageHandler $cancellationMessageHandler,
		private ReactivationMessageHandler $reactivationMessageHandler,
		private PaymentFailedMessageHandler $paymentFailedMessageHandler
	) {
	}

	public function handlePaymentFailed( string $stripeCustomer, string $firstName ) {
		$subscription          = $this->repository->getSubscription( $stripeCustomer );
		$userId                = $subscription['user_id'];
		$failedPaymentAttempts = $subscription['failed_payment_attempts'] ?? 0; // Default to 0
		$subscriptionId        = $subscription['stripe_subscription_id'];

		$messageLevels = array(
			0 => 1,
			1 => 2,
			2 => 3,
			3 => 3,
		);

		$level = $messageLevels[ $failedPaymentAttempts ] ?? null;

		if ( $level !== null ) {
			$this->repository->bumpFailedPaymentAttempts(
				customer: $stripeCustomer,
				prevValue: $failedPaymentAttempts
			);

			$this->paymentFailedMessageHandler->handle(
				level: $level,
				userId: $userId,
				firstName: $firstName
			);

			if ( $level === 3 ) {
				$this->repository->cancelSubscription( subscriptionId: $subscriptionId );
				$this->stripeAPI->cancelSubscription( subscriptionId: $subscriptionId );
			}
		}
	}

	public function getInvoice( Request $request, Response $response ) {
		$body      = $request->getParsedBody();
		$invoiceId = $body ['invoiceId'];
		try {
			$invoiceUrl = $this->stripeAPI->getInvoiceLink( $invoiceId );
			return Http::jsonResponse(
				$response,
				array(
					'status' => 'success',
					'data'   => array(
						'invoiceUrl' => $invoiceUrl,
					),
				)
			);
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
			if ( ! $this->securityChecks->verifyCustomerAccess(
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

	public function createSessionMonthly( Request $request, Response $response ) {
		return $this->createPaymentSession(
			request: $request,
			response: $response,
			priceId: $this->config->priceIdMonthly
		);
	}

	public function createSessionYearly( Request $request, Response $response ) {
		return $this->createPaymentSession(
			request: $request,
			response: $response,
			priceId: $this->config->priceIdYearly
		);
	}


	public function createPaymentSession( Request $request, Response $response, string $priceId ) {
		$body             = $request->getParsedBody();
		$userId           = $body['user_id'];
		$stripeCustomerId = $body['stripe_customer_id'];
		$locale           = $body['locale'];
		$currency         = $body['currency'];

		try {
			if ( ! $this->securityChecks->verifyCustomerAccess( $stripeCustomerId, $userId ) ) {
				return Http::errorResponse( $response, 'Unauthorized access', 403 );
			}

			$data = $this->stripeAPI->subscriptionSession(
				userId: $userId,
				stripeCustomerId: $stripeCustomerId,
				priceId: $priceId,
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

	public function createLifetimeSession( Request $request, Response $response ) {
		$body             = $request->getParsedBody();
		$userId           = $body['user_id'];
		$stripeCustomerId = $body['stripe_customer_id'];
		$locale           = $body['locale'];
		$currency         = $body['currency'];
		try {
			if ( ! $this->securityChecks->verifyCustomerAccess( $stripeCustomerId, $userId ) ) {
				return Http::errorResponse( $response, 'Unauthorized access', 403 );
			}

			$data = $this->stripeAPI->lifetimeSession(
				userId: $userId,
				stripeCustomerId: $stripeCustomerId,
				priceId: $this->config->priceIdLifetime,
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

			$data = $this->stripeAPI->customerPortal( $customer_id, $user_locale );
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
