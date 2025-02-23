<?php
namespace App\Services\Security;

use App\Config\Config;
use App\Database\Database;
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

	public function verifyInvoiceAccess( string $invoiceId, string $userId ): bool {
		$subscription = $this->repository->getSubscription( $userId );
		$hasAccess    = ( $subscription[0]['stripe_invoice_id'] === $invoiceId );

		return $hasAccess;
	}

	public function verifyCustomerAccess( string $customerId, string $userId ): bool {
		$subscription = $this->repository->getSubscription( $userId );
		$hasAccess    = ( $subscription[0]['stripe_customer_id'] === $customerId );

		return $hasAccess;
	}

	public function verifySubscriptionAccess( string $subscriptionId, string $userId ): bool {
		$subscription = $this->repository->getSubscription( $userId );
		$hasAccess    = ( $subscription[0]['stripe_subscription_id'] === $subscriptionId );

		return $hasAccess;
	}

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
