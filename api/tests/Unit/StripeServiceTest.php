<?php

use App\Repositories\SubscriptionRepository;
use App\Services\Message\Handlers\CancellationMessageHandler;
use App\Services\Message\Handlers\ReactivationMessageHandler;
use App\Services\Stripe\DTO\CheckoutSessionDTO;
use App\Services\Stripe\StripeAPIService;
use App\Services\StripeService;

it(
	'creates a checkout session',
	function () {
		// Arrange
		//
		$stripeApi                  = Mock( StripeAPIService::class );
		$repository                 = Mock( SubscriptionRepository::class );
		$cancellationMessageHandler = Mock( CancellationMessageHandler::class );
		$reactivationMessageHandler = Mock( ReactivationMessageHandler::class );
		$stripeService              = new StripeService(
			$stripeApi,
			$repository,
			$cancellationMessageHandler,
			$reactivationMessageHandler
		);

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
		$checkoutSession = $stripeService->createCheckoutSession( $sessionDto );

		// Assert
		expect( $checkoutSession )->toBe( 'test-session-id' )->dd();
	}
);
