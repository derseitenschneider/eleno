<?php

namespace App\Controllers;

use App\Repositories\EntityRepository;
use App\Repositories\LessonRepository;
use InvalidArgumentException;
use Monolog\Logger;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use RuntimeException;

class HomeworkController {

	/** @var string $entityId The id of either the student or the group */
	private $entityId;

	/** @var string $homeworkkey The unique homework key */
	private $homeworkKey;

	/**
	 * Constructor
	 *
	 * The class constructor.
	 *
	 * @param LessonRepository $lessonRepository
	 * @param EntityRepository $entityRepository
	 * @param Logger           $logger
	 */
	public function __construct(
		private LessonRepository $lessonRepository,
		private EntityRepository $entityRepository,
		private Logger $logger
	) {
	}

	/**
	 * Get homework
	 *
	 * Returns the homework view.
	 *
	 * @param Request  $request
	 * @param Response $response
	 * @param array    $args
	 */
	public function getHomework(
		Request $request,
		Response $response,
		array $args
	): Response {
		$this->entityId    = $args['entity_id'];
		$this->homeworkKey = $args['homework_key'];

		try {
			$lesson = $this->lessonRepository->getLesson( $this->homeworkKey );
			if ( ! $lesson || ! isset( $lesson[0] ) ) {
				$this->logger->warning(
					'Lesson not found',
					[ 'homework_key' => $this->homeworkKey ]
				);
				return $this->renderError( $response );
			}
			$lessonData = $lesson[0];

			// Check if studentId or groupId do not match with entityId
			if ( $this->entityId !== $lessonData['studentId']
				&& $this->entityId !== $lessonData['groupId']
			) {
				$this->logger->warning(
					'Unauthorized access attempt',
					[ 'homework_key' => $this->homeworkKey ]
				);
				return $this->renderError( $response );
			}

			// Check permission
			if ( ! $this->hasPermission( $lessonData ) ) {
				$response->getBody()->write( $this->renderView( 'homework-unauthorized' ) );
				return $response->withHeader( 'Content-Type', 'text/html' )->withStatus( 403 );
			}

			// Check expiration
			if ( $this->isExpired( $lessonData['expiration_base'] ) ) {
				$response->getBody()->write( $this->renderView( 'homework-expired' ) );
				return $response->withHeader( 'Content-Type', 'text/html' )->withStatus( 410 );
			}

			$formattedLesson = $this->formatLesson( $lessonData );

			$response->getBody()->write(
				$this->renderView( 'homework', $formattedLesson )
			);

			$this->logger->info(
				'Rendered homework template',
				[
					'entity_id'    => $this->entityId,
					'homework_key' => $this->homeworkKey,
				]
			);

			return $response->withHeader( 'Content-Type', 'text/html' );

		} catch ( \Exception $e ) {
			$this->logger->error(
				'Error rendering homework',
				[
					'entity_id'    => $this->entityId,
					'homework_key' => $this->homeworkKey,
				]
			);
			return $this->renderError( $response );
		}
	}

	/**
	 * Format lesson
	 *
	 * Formats homework data from lesson to be output in the homework view.
	 *
	 * @param array $lessonData
	 */
	private function formatLesson( array $lessonData ): array {
		$type = $lessonData['studentId'] ? 's' : 'g';
		return array(
			'date'         => $this->formatDate( $lessonData['date'] ),
			'entity_type'  => $type,
			'homework'     => $lessonData['homework'] ?? '',
			'related_name' => $lessonData['related_name'],
		);
	}

	/**
	 * Format date
	 *
	 * Formats date to be displayed in the homework view.
	 *
	 * @param string $date
	 */
	private function formatDate( string $date ): string {
		$dateObj = new \DateTime( $date );

		return $dateObj->format( 'd.m.y' );
	}

	/**
	 * Render error
	 *
	 * Renders the error view in case there is an error.
	 *
	 * @param Response $response
	 * @return Response
	 */
	private function renderError( Response $response ): Response {
		$response->getBody()->write( $this->renderView( 'error' ) );

		return $response->withStatus( 404 )->withHeader(
			'Content-Type',
			'text/html'
		);
	}

	/**
	 * Render view
	 *
	 * Renders the view html for the homework page.
	 *
	 * @param string $view
	 * @param array  $data
	 */
	private function renderView( string $view, array $data = array() ): string {
		extract( $data );
		ob_start();
		include __DIR__ . "/../Views/{$view}.php";
		return ob_get_clean();
	}

	/**
	 * Is Expired
	 *
	 * Checks if the homework was created more than two weeks ago.
	 *
	 * @param string $expirationBase
	 * @return bool
	 */
	private function isExpired( string $expirationBase ) {
		$createdDate = new \DateTime( $expirationBase );
		$twoWeeksAgo = new \DateTime( '-2 weeks' );

		return $createdDate < $twoWeeksAgo;
	}

	/**
	 * Has permission
	 *
	 * Checks if the student has permission to view the homework based on the
	 * users confirmation that the student is either 18 years old or the user
	 * has permission from the student's parents to share the homework via a link.
	 *
	 * @param mixed $lessonData
	 * @return bool
	 */
	private function hasPermission( mixed $lessonData ) {
		$entity = $this->entityId === $lessonData['studentId']
				? $this->entityRepository->getStudent( $this->entityId )
				: $this->entityRepository->getGroup( $this->entityId );

		return $entity[0]['homework_sharing_authorized'];
	}
}
