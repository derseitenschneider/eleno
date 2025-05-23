<?php

namespace App\Controllers;

use App\Config\Config;
use App\Core\Http;
use App\Services\Stripe\WebhookHandler;
use InvalidArgumentException;
use Monolog\Logger;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use RuntimeException;
use Stripe\Webhook;

class WebhookController {
	/**
	 * Constructor
	 *
	 * The class constructor.
	 *
	 * @param Config         $config
	 * @param WebhookHandler $webhookHandler
	 * @param Logger         $logger
	 */
	public function __construct(
		private Config $config,
		private WebhookHandler $webhookHandler,
		private Logger $logger,
	) {
	}

	/**
	 * Handle Webhook
	 *
	 * Takes all incoming webhook requests, checks the stripe signature and
	 * defers events to the webhookhandler.
	 *
	 * @param Request  $request
	 * @param Response $response
	 * @throws RuntimeException Exception, when parsing error.
	 * @throws InvalidArgumentException Exception, when invalid signature.
	 */
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
			$this->logger->error( 'Webhook controller error: ' . $e->getMessage() );
			return Http::errorResponse( $response, $e->getMessage(), 400 );

		} catch ( \Stripe\Exception\SignatureVerificationException $e ) {
			$this->logger->error( 'Error verifying webhook signature: ' . $e->getMessage() );
			return Http::errorResponse(
				$response,
				'Error verifying webhook signature: ' . $e->getMessage()
			);
		}
	}
}
