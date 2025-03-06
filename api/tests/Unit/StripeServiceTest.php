<?php

use App\Repositories\SubscriptionRepository;
use App\Services\Message\Handlers\CancellationMessageHandler;
use App\Services\Message\Handlers\ReactivationMessageHandler;
use App\Services\Stripe\DTO\CheckoutSessionDTO;
use App\Services\Stripe\StripeAPIService;
use App\Services\StripeService;
use phpDocumentor\Reflection\Types\Void_;
use Stripe\BillingPortal\Session as BillingPortalSession;
use Stripe\Checkout\Session;
use Stripe\Subscription;

function createStripeApiMock() {
	$stripeApi         = Mockery::mock( StripeAPIService::class );
	$mockSession       = Mockery::mock( Session::class );
	$mockPortalSession = Mockery::mock( BillingPortalSession::class );
	$mockSubscription  = Mockery::mock( Subscription::class );
	$stripeApi->allows(
		[
			'getInvoiceUrl'          => 'invoice-url',
			'createCustomerPortal'   => $mockPortalSession,
			'createSession'          => $mockSession,
			'deleteCustomer'         => null,
			'cancelAllSubscriptions' => null,
			'updateSubscription'     => $mockSubscription,
		]
	);

	return $stripeApi;
}

function createRepositoryMock() {
	$subscriptionRepository = Mockery::mock( SubscriptionRepository::class );
	$subscriptionRepository->allows(
		[
			'cancelSubscription'     => true,
			'reactivateSubscription' => true,
		]
	);
	return $subscriptionRepository;
}

function createCancellationMessageHandlerMock() {
	$cancellationMessageHandler = Mockery::mock( CancellationMessageHandler::class );
	$cancellationMessageHandler->allows(
		[
			'handle' => null,
		]
	);
	return $cancellationMessageHandler;
}

function createReactivationMessageHandlerMock() {
	$reactivationMessageHandler = Mockery::mock( ReactivationMessageHandler::class );
	$reactivationMessageHandler->allows(
		[
			'handle' => null,
		]
	);
	return $reactivationMessageHandler;
}

beforeEach(
	function () {
		$this->stripeApi                  = createStripeApiMock();
		$this->subscriptionRepository     = createRepositoryMock();
		$this->cancellationMessageHandler = createCancellationMessageHandlerMock();
		$this->reactivationMessageHandler = createReactivationMessageHandlerMock();
		$this->stripeService              = new StripeService(
			$this->stripeApi,
			$this->subscriptionRepository,
			$this->cancellationMessageHandler,
			$this->reactivationMessageHandler
		);
	}
);

it(
	'has a method named createCheckoutsession that returns a checkoutsession.',
	function () {
		// Arrange
		$sessionDto = CheckoutSessionDTO::create(
			userId: 1,
			priceId: 'price_123',
			stripeCustomerId: 'cus_abc',
			mode: 'subscription',
			locale: 'en',
			currency: 'usd',
			cancelUrl: 'https://example.com/cancel',
			succesUrl: 'https://example.com/success'
		);

		// Act
		$checkoutSession = $this->stripeService->createCheckoutSession( $sessionDto );

		// Assert
		expect( $checkoutSession )->toBeInstanceOf( Session::class );
	}
);

it(
	'has a method named createCustomerPortal that returns a portal session.',
	function () {
		// Act
		$customerPortal = $this
			->stripeService
			->createCustomerPortal( 'customer-id', 'userLocale' );

		// Assert
		expect( $customerPortal )->toBeInstanceOf( BillingPortalSession::class );
	}
);

it(
	'has a method named getInvoice that returns the invoice-url.',
	function () {
		// Act
		$invoiceUrl = $this->stripeService->getInvoice( 'invoice-id' );

		// Assert
		expect( $invoiceUrl )->toBe( 'invoice-url' );
	}
);

it(
	'has a method named deleteCustomer that returns void.',
	function () {
		// Act
		$result = $this->stripeService->deleteCustomer( 'customer-id' );

		// Assert
		expect( $result )->toBeNull;
	}
);

it(
	'has a method named cancelAtPeriodEnd that returns void.',
	function () {
		// Act
		$result = $this->stripeService->cancelAtPeriodEnd(
			'subscription-id',
			'user-id',
			'first-name'
		);
		// Assert
		expect( $result )->toBeNull;
	}
);

it(
	'has a method named handleReactivation that returns void.',
	function () {
		// Act
		$result = $this->stripeService->handleReactivation(
			'subscription-id',
			'user-id',
			'first-name'
		);

		// Assert
		expect( $result )->toBeNull;
	}
);
