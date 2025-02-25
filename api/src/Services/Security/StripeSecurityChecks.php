<?php
namespace App\Services\Security;

use App\Config\Config;
use App\Repositories\SubscriptionRepository;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Monolog\Logger;
use Psr\Http\Message\ServerRequestInterface as Request;

class StripeSecurityChecks {
	public function __construct(
		private SubscriptionRepository $repository,
		private Config $config,
		private Logger $logger
	) {
	}

	/**
	 * Verify invoice access
	 *
	 * Checks if user is allowed to have access by comparing the provided
	 * invoiceId with the one from the stripe subscprition object in the database.
	 *
	 * @param string $invoiceId
	 * @param string $userId
	 *
	 * @throws Exception
	 */
	public function verifyInvoiceAccess( string $invoiceId, string $userId ): bool {
		$subscription = $this->repository->getSubscription( userId: $userId );
		$hasAccess    = ( $subscription['stripe_invoice_id'] === $invoiceId );

		return $hasAccess;
	}

	/**
	 * Verify customer access
	 *
	 * Checks if user is allowed to have access by comparing the provided
	 * customerId with the one from the stripe subscprition object in the database.
	 *
	 * @param string $customerId
	 * @param string $userId
	 *
	 * @throws Exception
	 */
	public function verifyCustomerAccess( string $customerId, string $userId ): bool {
		$subscription = $this->repository->getSubscription( userId: $userId );
		$hasAccess    = ( $subscription['stripe_customer_id'] === $customerId );

		return $hasAccess;
	}

	/**
	 * Verify subscription access
	 *
	 * Checks if user is allowed to have access by comparing the provided
	 * subscriptionId with the one from the stripe subscprition object in the database.
	 *
	 * @param string $subscriptionId
	 * @param string $userId
	 *
	 * @throws Exception
	 */
	public function verifySubscriptionAccess( string $subscriptionId, string $userId ): bool {
		$subscription = $this->repository->getSubscription( userId: $userId );
		$hasAccess    = ( $subscription['stripe_subscription_id'] === $subscriptionId );

		return $hasAccess;
	}

	/**
	 * Get userId from request
	 *
	 * Decodes the auth header and returns the userId or null.
	 *
	 * @param Request $request
	 * @return null|string
	 */
	public function getUserIdFromRequest( Request $request ): ?string {
		$headers    = $request->getHeaders();
		$authHeader = $headers['Authorization'][0] ?? '';

		if ( ! $authHeader || ! preg_match( '/^Bearer\s+(.*)$/', $authHeader, $matches ) ) {
			return null;
		}

		try {
			$decoded = JWT::decode(
				$matches[1],
				new Key( $this->config->supabaseJwtSecret, 'HS256' )
			);
			return $decoded->sub ?? null;
		} catch ( \Exception $e ) {
			$this->logger->error( 'JWT decoding error: ' . $e->getMessage() );
			return null;
		}
	}
}
