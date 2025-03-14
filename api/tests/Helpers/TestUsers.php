<?php

namespace Tests\Helpers;

use Stripe\Customer;
use Stripe\Exception\ApiErrorException;
use Tests\Utils\StripeTestManager;
use Tests\Utils\UserManager;

class TestUsers {
	/** @var UserManager $userManager */
	private static $userManager;

	/** @var StripeTestManager $stripeManager */
	private static $stripeManager;

	/** @return void  */
	public static function init() {
		self::$userManager   = new UserManager();
		self::$stripeManager = new StripeTestManager();
	}

	/**
	 * @param mixed $email
	 * @return mixed $user
	 */
	public static function createUser( $email = null ) {
		return self::$userManager->createUser( $email );
	}

	/**
	 * @param string $email
	 * @param string $userId
	 * @return Customer
	 * @throws ApiErrorException Stripe Api Error/Exception.
	 */
	public static function createStripeCustomer( string $email, string $userId ) {
		return self::$stripeManager->createCustomer( email: $email, userId: $userId );
	}

	/**
	 * @param string $userId
	 * @return true
	 */
	public static function deleteUser( string $userId ) {
		return self::$userManager->deleteUser( $userId );
	}

	/**
	 * @param string $customerId
	 * @return Customer
	 * @throws ApiErrorException Stripe Api Error/Exception.
	 */
	public static function deleteStripeCustomer( string $customerId ) {
		return self::$stripeManager->deleteCustomer( customerId: $customerId );
	}
}

// Initialize
TestUsers::init();
