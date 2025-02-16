<?php

namespace App\Controllers\Stripe;

use App\Config\Config;
use App\Core\Http;
use App\Services\Stripe\DTO\CheckoutSessionDTO;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Services\StripeService;

class SessionController {
	public function __construct(
		private StripeService $stripeService,
		private Config $config
	) {
	}

	public function createSession( Request $request, Response $response ) {
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
}
