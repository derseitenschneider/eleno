<?php

use App\Repositories\SubscriptionRepository;
use App\Services\Message\Handlers\CancellationMessageHandler;
use App\Services\Message\Handlers\ReactivationMessageHandler;
use App\Services\Stripe\DTO\CheckoutSessionDTO;
use App\Services\Stripe\StripeAPIService;
use App\Services\StripeService;
use Stripe\BillingPortal\Session as BillingPortalSession;
use Stripe\Checkout\Session;

it(
	'correctly retrieves invoice URL from Stripe Api.',
	function () {
		// ARRANGE
		$invoiceId   = 'invoice-id';
		$expectedUrl = 'invoice-url';

		// Create a mock for StripeAPIService.
		$stripeApiMock = Mockery::mock( StripeAPIService::class );

		// Set up the expectation that the getInvoiceUrl method will be called
		// once with the correct invoice ID and will return the expected URL.
		$stripeApiMock
			->shouldReceive( 'getInvoiceUrl' )
			->once()
			->with( $invoiceId )
			->andReturn( $expectedUrl );

		// Create a StripeService instance with only the necessary dependency.
		$stripeService = new StripeService(
			$stripeApiMock,
			Mockery::mock( SubscriptionRepository::class ),
			Mockery::mock( CancellationMessageHandler::class ),
			Mockery::mock( ReactivationMessageHandler::class ),
		);

		// ACT
		$invoiceUrl = $stripeService->getInvoiceUrl( $invoiceId );

		// ASSERT
		expect( $invoiceUrl )->toBe( $expectedUrl );
	}
);

it(
	'cancels all subscriptions and deletes the customer.',
	function () {
		// ARRANGE
		$customerId = 'customer-id';

		// Create a mock for StripeAPIService.
		$stripeApiMock = Mockery::mock( StripeAPIService::class );

		// Set up the expectation that the cancelAllSubscriptions method will
		// be called once with the customer ID.
		$stripeApiMock
			->shouldReceive( 'cancelAllSubscriptions' )
			->once()
			->with( $customerId );

		// Set up the expectation that the deleteCustomer method will be called
		// once with the customer ID.
		$stripeApiMock
			->shouldReceive( 'deleteCustomer' )
			->once()
			->with( $customerId );

		// Create a StripeService instance with only the necessary dependency.
		$stripeService = new StripeService(
			$stripeApiMock,
			Mockery::mock( SubscriptionRepository::class ),
			Mockery::mock( CancellationMessageHandler::class ),
			Mockery::mock( ReactivationMessageHandler::class ),
		);

		// ACT
		$result = $stripeService->deleteCustomer( $customerId );

		// ASSERT (Method returns void, implicitly done by shouldReceive).
	}
);

it(
	'creates and returns a stripe checkout session.',
	function () {
		// ARRANGE
		$sessionDTO = CheckoutSessionDTO::create(
			userId: 'user-id',
			stripeCustomerId: 'customer-id',
			priceId: 'price-id',
			mode: 'mode',
			locale: 'locale',
			currency: 'curreny',
			cancelUrl: 'cancel-url',
			succesUrl: 'success-url',
		);

		$mockSession = Mockery::mock( Session::class );

		// Create a mock for StripeAPIService.
		$stripeApiMock = Mockery::mock( StripeAPIService::class );

		// Set up the expectation that the cancelAllSubscriptions method will
		// be called once with the customer ID.
		$stripeApiMock
			->shouldReceive( 'createSession' )
			->once()
			->with( $sessionDTO )
			->andReturn( $mockSession );

		// Create a StripeService instance with only the necessary dependency.
		$stripeService = new StripeService(
			$stripeApiMock,
			Mockery::mock( SubscriptionRepository::class ),
			Mockery::mock( CancellationMessageHandler::class ),
			Mockery::mock( ReactivationMessageHandler::class ),
		);

		// ACT
		$session = $stripeService->createCheckoutSession( $sessionDTO );

		// ASSERT
		expect( $session )->toBeInstanceOf( Session::class );
	}
);

it(
	'creates and returns a customer portal session.',
	function () {
		// ARRANGE
		$customerId = 'customer-id';
		$userLocale = 'user-locale';

		$mockPortal = Mockery::mock( BillingPortalSession::class );
		// Create a mock for StripeAPIService.
		$stripeApiMock = Mockery::mock( StripeAPIService::class );

		// Set up the expectation that the createCustomerPortal method will
		// be called once with the customer ID and the user locale and return
		// the customer portal session.
		$stripeApiMock
			->shouldReceive( 'createCustomerPortal' )
			->once()
			->with( $customerId, $userLocale )
			->andReturn( $mockPortal );

		// Create a StripeService instance with only the necessary dependency.
		$stripeService = new StripeService(
			$stripeApiMock,
			Mockery::mock( SubscriptionRepository::class ),
			Mockery::mock( CancellationMessageHandler::class ),
			Mockery::mock( ReactivationMessageHandler::class ),
		);

		// ACT
		$customerPortal = $stripeService->createCustomerPortal(
			$customerId,
			$userLocale
		);

		// ASSERT
		expect( $customerPortal )->toBeInstanceOf( BillingPortalSession::class );
	}
);

it(
	'cancels a subscription at period end.',
	function () {
		// ARRANGE
		$subscriptionId = 'subscription-id';
		$userId         = 'user-id';
		$firstName      = 'first-name';

		// Create mocks for method calls
		$stripeApiMock                  = Mockery::mock( StripeAPIService::class );
		$repositoryMock                 = Mockery::mock( SubscriptionRepository::class );
		$cancellationMessageHandlerMock = Mockery::mock( CancellationMessageHandler::class );

		// Set up the expectation that the updateSubscription method will
		// be called once on the stripe API with the subscription ID and an
		// array with 'cancel_at_period_end' set to true.
		$stripeApiMock
			->shouldReceive( 'updateSubscription' )
			->once()
			->with(
				$subscriptionId,
				[ 'cancel_at_period_end' => true ]
			);

		// Set up the expectation that the cancelSubscription method will
		// be called once on the repository  with the subscription ID.
		$repositoryMock
			->shouldReceive( 'cancelSubscription' )
			->once()
			->with( $subscriptionId );

		// Set up the expectation that the handle method will be called once
		// on the cancellation message hander with the user ID and the
		// first name.
		$cancellationMessageHandlerMock
			->shouldReceive( 'handle' )
			->once()
			->with( $userId, $firstName );

		// Create a StripeService instance with only the necessary dependency.
		$stripeService = new StripeService(
			$stripeApiMock,
			$repositoryMock,
			$cancellationMessageHandlerMock,
			Mockery::mock( ReactivationMessageHandler::class ),
		);

		// ACT
		$stripeService->cancelAtPeriodEnd(
			$subscriptionId,
			$userId,
			$firstName
		);

		// ASSERT (Method returns void, implicitly done by shouldReceive).
	}
);
