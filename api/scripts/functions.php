<?php
use App\Repositories\SubscriptionRepository;

function expirePeriod( string $userId, SubscriptionRepository $repo, ?bool $dry = false ) {
	$periodStart = date( 'Y-m-d', strtotime( '-31 days' ) );
	$periodEnd   = date( 'Y-m-d', strtotime( '-1 day' ) );

	if ( ! $dry ) {
		$repo->updateSubscription(
			data: array(
				'period_start' => $periodStart,
				'period_end'   => $periodEnd,
			),
			where: array( 'user_id' => $userId )
		);
	}

	echo "Subscription period updated to: {$periodStart} - {$periodEnd}\n";
}

function renewPeriod( string $userId, SubscriptionRepository $repo, ?bool $dry = false ) {
	$periodStart = date( 'Y-m-d' );
	$periodEnd   = date( 'Y-m-d', strtotime( '+30 days' ) );

	if ( ! $dry ) {
		$repo->updateSubscription(
			data: array(
				'period_start' => $periodStart,
				'period_end'   => $periodEnd,
			),
			where: array( 'user_id' => $userId )
		);
	}

	echo "Subscription period updated to: {$periodStart} - {$periodEnd}\n";
}
