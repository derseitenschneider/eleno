<?php

namespace Tests\Utils;

use App\Config\Config;
use App\Database\Database;
use Dotenv\Dotenv;


class SubscriptionStates {

	/**
	 * @var Database $db
	 */
	private static $db;

	/**
	 * @var string  $statesDir
	 */
	private static $statesDir;

	/**
	 * @param  mixed $db
	 * @param  mixed $statesDir
	 * @return void
	 */
	public static function init( $db = null, $statesDir = null ) {
		$config          = new Config();
		self::$db        = $db ?? new Database( $config );
		self::$statesDir = $statesDir ?? __DIR__ . '/subscription-states';
	}

	/**
	 * Applies the subscription state to the database.
	 *
	 * @param  mixed $userId
	 * @param  mixed $state
	 * @return true
	 * @throws Exception Database exception.
	 */
	public static function apply( $userId, $state ) {
		$definition = self::getStateDefinition( $state );
		$definition = self::processDateValues( $definition );

		self::$db->update(
			table: 'stripe_subscriptions',
			data: $definition,
			where:[ 'user_id' => $userId ]
		);

		return true;
	}

	/**
	 * @param  mixed $userId
	 * @param  mixed $state
	 * @return bool
	 * @throws Exception Database exception.
	 */
	public static function verify( $userId, $state ) {
		$definition = self::getStateDefinition( $state );
		$dbRow      = self::$db->query(
			'SELECT * FROM stripe_subscriptions WHERE user_id = $1',
			[ $userId ]
		)[0];
		var_dump( $userId );

		// Compare each defined field
		foreach ( $definition as $key => $expectedValue ) {
			echo "Checking {$key}...\n";
			if ( is_string( $expectedValue )
				&& ( strpos( $expectedValue, 'CURRENT_DATE' ) === 0 )
			) {
				if ( null === $dbRow[ $key ] ) {
					echo "{$key} should not be null!\n";
					return false;
				}
				echo "Skip {$key} check...\n";
				continue;
			}

			if ( $dbRow[ $key ] !== $expectedValue ) {

				echo "Error for {$key}:\n ";
				echo "expected {$expectedValue}, found {$dbRow[$key]}.\n";
				return false;
			}
		}

		return true;
	}

	/**
	 * @param  mixed $state
	 * @return mixed
	 * @throws \Exception Filesystem error when state json file not found.
	 */
	private static function getStateDefinition( $state ) {
		$filePath = self::$statesDir . "/{$state}.json";
		if ( ! file_exists( $filePath ) ) {
			throw new \Exception( "State definition not found: {$state}" );
		}

		return json_decode( file_get_contents( $filePath ), true );
	}

	/**
	 * @param  mixed $definition
	 * @return array
	 * @throws DateMalformedStringException When date is not formatted correctly.
	 */
	private static function processDateValues( $definition ) {
		$processed = [];

		foreach ( $definition as $key => $value ) {
			if ( is_string( $value ) ) {
				// Handle date placeholders
				if ( 'CURRENT_DATE' === $value ) {
					$processed[ $key ] = date( 'Y-m-d H:i:s' );
				} elseif ( strpos( $value, 'CURRENT_DATE + INTERVAL' ) === 0 ) {
					// Extract interval
					preg_match( "/'(\d+) (\w+)'/", $value, $matches );
					if ( count( $matches ) === 3 ) {
						$amount = $matches[1];
						$unit   = $matches[2];

						// Calculate future date
						$date = new \DateTime();
						$date->modify( "+{$amount} {$unit}" );
						$processed[ $key ] = $date->format( 'Y-m-d H:i:s' );
					} else {
						$processed[ $key ] = $value; // Can't parse, use as is
					}
				} else {
					$processed[ $key ] = $value;
				}
			} else {
				$processed[ $key ] = $value;
			}
		}

		return $processed;
	}
}

// Initialize by default
SubscriptionStates::init();
