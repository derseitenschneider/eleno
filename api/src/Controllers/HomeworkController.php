<?php

namespace App\Controllers;

use App\Repositories\LessonRepository;
use InvalidArgumentException;
use Monolog\Logger;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use RuntimeException;

class HomeworkController {

	/**
	 * Constructor
	 *
	 * The class constructor.
	 *
	 * @param LessonRepository $repository
	 * @param Logger           $logger
	 */
	public function __construct(
		private LessonRepository $repository,
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
		$entity_id   = $args['entity_id'];
		$homeworkKey = $args['homework_key'];

		try {
			$lesson = $this->repository->getLesson( $homeworkKey );
			if ( ! $lesson || ! isset( $lesson[0] ) ) {
				$this->logger->warning(
					'Lesson not found',
					[ 'homework_key' => $homeworkKey ]
				);
				return $this->renderError( $response );
			}
			$lessonData = $lesson[0];

			if ( $entity_id !== $lessonData['studentId']
				&& $entity_id !== $lessonData['groupId']
			) {
				$this->logger->warning(
					'Unauthorized access attempt',
					[ 'homework_key' => $homeworkKey ]
				);
				return $this->renderError( $response );
			}

			$formattedLesson = $this->formatLesson( $lessonData );

			$response->getBody()->write(
				$this->renderView( 'homework', $formattedLesson )
			);

			$this->logger->info(
				'Rendered homework template',
				[
					'entity_id'    => $entity_id,
					'homework_key' => $homeworkKey,
				]
			);

			return $response->withHeader( 'Content-Type', 'text/html' );
		} catch ( \Exception $e ) {
			$this->logger->error(
				'Error rendering homework',
				[
					'entity_id'    => $entity_id,
					'homework_key' => $homeworkKey,
				]
			);
			return $this->renderError( $response );
		}
	}

	/**
	 * Format lesson
	 *
	 * Formts homework data from lesson to be output in the homework view.
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
}
