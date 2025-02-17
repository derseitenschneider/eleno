<?php
namespace App\Services\Security;

use App\Config\Config;
use App\Services\SupabaseService;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Psr\Http\Message\ServerRequestInterface as Request;

class StripeSecurityChecks {
	public function __construct( private SupabaseService $supabase, private Config $config ) {
	}

	public function verifyInvoiceAccess( string $invoiceId, string $userId ): bool {
		$query = array(
			'select'            => 'user_id,stripe_customer_id',
			'user_id'           => 'eq.' . $userId,
			'stripe_invoice_id' => 'eq.' . $invoiceId,
		);

		$result = $this->supabase->get( endpoint: 'stripe_subscriptions', query: $query );

		return ! empty( $result['data'] );
	}

	public function verifyCustomerAccess( string $customerId, string $userId ): bool {
		$query = array(
			'select'             => 'user_id,stripe_customer_id',
			'user_id'            => 'eq.' . $userId,
			'stripe_customer_id' => 'eq.' . $customerId,
		);

		$result = $this->supabase->get( endpoint: 'stripe_subscriptions', query: $query );

		return ! empty( $result['data'] );
	}

	public function verifySubscriptionAccess( string $subscriptionId, string $userId ): bool {
		$query = array(
			'select'                 => 'user_id,stripe_subscription_id',
			'user_id'                => 'eq.' . $userId,
			'stripe_subscription_id' => 'eq.' . $subscriptionId,
		);

		$result = $this->supabase->get( endpoint: 'stripe_subscriptions', query: $query );

		return ! empty( $result['data'] );
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
			return null;
		}
	}
}
