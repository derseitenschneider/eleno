<?php

namespace Tests\Helpers;

use Tests\Utils\UserManager;

class TestUsers {
	/** @var UserManager $userManager */
	private static $userManager;

	/** @return void  */
	public static function init() {
		self::$userManager = new UserManager();
	}

	/**
	 * @param mixed $email
	 * @return string $userId
	 */
	public static function create( $email = null ) {
		return self::$userManager->createUser( $email );
	}

	/**
	 * @param mixed $userId
	 * @return true
	 */
	public static function delete( $userId ) {
		return self::$userManager->deleteUser( $userId );
	}
}

// Initialize
TestUsers::init();
