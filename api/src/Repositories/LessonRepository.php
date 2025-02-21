<?php
namespace App\Repositories;

use App\Database\Database;
use App\Services\Stripe\DTO\StripeCheckoutCompletedDTO;
use App\Services\Stripe\DTO\StripeSubscriptionUpdatedDTO;

class LessonRepository {
	private $table = 'lessons';

	public function __construct(
		private Database $db,
	) {
	}

	public function getLesson( string $homeworkKey ) {
		$sql     = sprintf( 'SELECT * FROM %s WHERE lessons."homeworkKey" = $1', $this->table );
		$results = $this->db->query( $sql, [ $homeworkKey ] );

		return $results;
	}
}
