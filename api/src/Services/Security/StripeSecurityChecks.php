<?php
namespace App\Services\Security;

use App\Config\Config;
use App\Services\SupabaseService;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Psr\http\Message\ServerRequestInterface as Request;

trait StripeSecurityChecks {
	private SupabaseService $supabase;

	private function verifyCustomerAccess( string $customerId, string $userId ): bool {
		$result = $this->supabase->get(
			endpoint: 'stripe_subscriptions',
			query: array(
				'select'             => 'user_id,stripe_customer_id',
				'user_id'            => 'eq.' . $userId,
				'stripe_customer_id' => 'eq.' . $customerId,
			)
		);
		return ! empty( $result['data'] );
	}

	private function verifySubscriptionAccess( string $subscriptionId, string $userId ): bool {
		$result = $this->supabase->get(
			endpoint: 'stripe_subscriptions',
			query: array(
				'select'                 => 'user_id,stripe_subscription_id',
				'user_id'                => 'eq.' . $userId,
				'stripe_subscription_id' => 'eq.' . $subscriptionId,
			)
		);
		return ! empty( $result['data'] );
	}

	private function getUserIdFromRequest( Request $request ): ?string {
		$headers    = $request->getHeaders();
		$authHeader = $headers['Authorization'][0] ?? '';

		if ( ! $authHeader || ! preg_match( '/^Bearer\s+(.*)$/', $authHeader, $matches ) ) {
			return null;
		}

		try {
			$decoded = JWT::decode(
				$matches[1],
				new Key( Config::getInstance()->supabaseJwtSecret, 'HS256' )
			);
			return $decoded->sub ?? null;
		} catch ( \Exception $e ) {
			return null;
		}
	}

	private function verifyAccess( Request $request, string $identifier, string $type = 'customer' ): bool {
		$userId = $this->getUserIdFromRequest( $request );
		if ( ! $userId ) {
			return false;
		}
		return match ( $type ) {
			'customer' => $this->verifyCustomerAccess( $identifier, $userId ),
			'subscription'=> $this->verifySubscriptionAccess( $identifier, $userId ),
			default => false
		};
	}
}
