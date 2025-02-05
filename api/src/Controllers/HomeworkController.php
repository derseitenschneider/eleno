<?php

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Services\SupabaseService;

class HomeworkController {
	private $supabase;

	public function __construct( SupabaseService $supabase ) {
		$this->supabase = $supabase;
	}

	public function getHomework(
		Request $request,
		Response $response,
		array $args
	): Response {
		$entity_id   = (int) $args['entity_id'];
		$homeworkKey = $args['homework_key'];

		try {
			$lesson = $this->supabase->getLesson( $homeworkKey );
			if ( ! $lesson || ! isset( $lesson['data'] ) ) {
				return $this->renderError( $response );
			}
			$lessonData = $lesson['data'][0];

			if ( $entity_id !== $lessonData['studentId']
				&& $entity_id !== $lessonData['groupId']
			) {
				return $this->renderError( $response );
			}

			$formattedLesson = $this->formatLesson( $lessonData );

			$response->getBody()->write(
				$this->renderView( 'homework', $formattedLesson )
			);

			return $response->withHeader( 'Content-Type', 'text/html' );
		} catch ( \Exception $e ) {
			return $this->renderError( $response );
		}
	}

	private function formatLesson( $lessonData ): array {
		return array(
			'date'        => $this->formatDate( $lessonData['date'] ),
			'entity_name' => $lessonData['students']['firstName']
			?? $lessonData['groups']['name'],
			'entity_type' => $lessonData['students'] ? 's' : 'g',
			'homework'    => $lessonData['homework'] ?? '',
		);
	}

	private function formatDate( $date ): string {
		$dateObj = new \DateTime( $date );

		return $dateObj->format( 'd.m.y' );
	}

	private function renderError( Response $response ): Response {
		$response->getBody()->write( $this->renderView( 'error' ) );

		return $response->withStatus( 404 )->withHeader(
			'Content-Type',
			'text/html'
		);
	}

	private function renderView( string $view, array $data = array() ): string {
		extract( $data );
		ob_start();
		include __DIR__ . "/../Views/{$view}.php";
		return ob_get_clean();
	}
}
