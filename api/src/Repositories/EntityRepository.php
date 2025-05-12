<?php
namespace App\Repositories;

use App\Database\Database;
use App\Services\Stripe\DTO\StripeCheckoutCompletedDTO;
use App\Services\Stripe\DTO\StripeSubscriptionUpdatedDTO;

class EntityRepository {

	/**
	 * Construct
	 *
	 * The class constructor.
	 *
	 * @param Database $db
	 */
	public function __construct(
		private Database $db,
	) {
	}

	/**
	 * Get Student
	 *
	 * Retrieves a student based on the students id.
	 *
	 * @param int $studentId
	 */
	public function getStudent( int $studentId ): array|false {
		$sql = <<<SQL
		SELECT *
		FROM students
		WHERE id = $1
		SQL;

		$results = $this->db->query( $sql, [ $studentId ] );

		return $results;
	}

	/**
	 * Get group
	 *
	 * Retrieves a group based on the groups id.
	 *
	 * @param int $groupId
	 */
	public function getGroup( int $groupId ): array|false {
		$sql = <<<SQL
		SELECT *
		FROM groups
		WHERE id = $1
		SQL;

		$results = $this->db->query( $sql, [ $groupId ] );

		return $results;
	}
}
