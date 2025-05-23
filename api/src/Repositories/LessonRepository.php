<?php
namespace App\Repositories;

use App\Database\Database;
use App\Services\Stripe\DTO\StripeCheckoutCompletedDTO;
use App\Services\Stripe\DTO\StripeSubscriptionUpdatedDTO;

class LessonRepository {

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
	 * Get Lesson
	 *
	 * Retrieves lesson based on homework key combined with either
	 * the first name if it's from a student or the name if it's
	 * from a group as 'related_name'.
	 *
	 * @param string $homeworkKey
	 */
	public function getLesson( string $homeworkKey ): array|false {
		$sql     = '
        SELECT 
            l.*, COALESCE(s."firstName", g.name) AS related_name 
        FROM 
            lessons l 
        LEFT JOIN 
            students s ON l."studentId" = s.id 
        LEFT JOIN 
            groups g ON l."groupId" = g.id 
        WHERE 
            l."homeworkKey" = $1
        ';
		$results = $this->db->query( $sql, [ $homeworkKey ] );

		return $results;
	}
}
