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
			'homework'     => $this->removeHTMLAttributes( $lessonData['homework'] ?? '' ),
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
	/**
	 * Removes all HTML attributes from tags except for 'href' and 'target' on 'a' tags.
	 *
	 * This function parses the input HTML string and processes each tag and text content.
	 * - Text content is returned as is.
	 * - For any tag other than 'a', all its attributes are removed, leaving only the tag name.
	 * - For 'a' tags, only the 'href' and 'target' attributes are preserved. If 'target' is not found,
	 * it defaults to 'target="_blank"'.
	 *
	 * @param string $html The input HTML string.
	 * @return string The HTML string with attributes removed as per the rules.
	 */
	private function removeHTMLAttributes( string $html ): string {
		$tagRegex = '/(<(\w+)((?:\\s+[^>]*)?)>)|([^<]+)/is';

		return preg_replace_callback(
			$tagRegex,
			function ( array $matches ) {
				// $matches[0] contains the entire matched string (either a tag or text content)
				// $matches[1] contains the full tag matched (e.g., "<div>" or "<a href="...">")
				// $matches[2] contains the tag name (e.g., "div", "p", "a")
				// $matches[3] contains the attributes string (e.g., " class=\"test\" id=\"my-id\"")
				// $matches[4] contains the text content (if it's not a tag)

				$fullTag     = $matches[1];
				$tagName     = $matches[2];
				$attributes  = $matches[3];
				$textContent = $matches[4];

				// If it's text content, return it as is
				if ( ! empty( $textContent ) ) {
					return $textContent;
				}

				// If it's not an 'a' tag, remove all attributes by returning just the tag name
				if ( strtolower( $tagName ) !== 'a' ) {
					return "<{$tagName}>";
				}

				// For 'a' tags, keep href and target attributes
				$href   = '';
				$target = '';

				// Match href attribute: \s+href\s*=\s*("[^"]*"|'[^']*'|\S+)
				// Matches whitespace, 'href', optional whitespace, '=', optional whitespace, then captures
				// either double-quoted string, single-quoted string, or non-whitespace characters.
				if ( preg_match( '/\\s+href\\s*=\\s*("[^"]*"|\'[^\']*\'|\\S+)/i', $attributes, $hrefMatch ) ) {
					$href = $hrefMatch[0]; // Keep the entire matched href attribute string
				}

				// Match target attribute: \s+target\s*=\s*("[^"]*"|'[^']*'|\\S+)
				// Matches whitespace, 'target', optional whitespace, '=', optional whitespace, then captures
				// either double-quoted string, single-quoted string, or non-whitespace characters.
				if ( preg_match( '/\\s+target\\s*=\\s*("[^"]*"|\'[^\']*\'|\\S+)/i', $attributes, $targetMatch ) ) {
					$target = $targetMatch[0]; // Keep the entire matched target attribute string
				} else {
					// If target attribute is not found, default to target="_blank"
					$target = 'target="_blank"';
				}

				// Reconstruct the 'a' tag with only the preserved attributes
				$outputAttributes = [];
				if ( ! empty( $href ) ) {
					$outputAttributes[] = trim( $href );
				}
				if ( ! empty( $target ) ) {
					$outputAttributes[] = trim( $target );
				}

				return "<{$tagName}" . ( ! empty( $outputAttributes ) ? ' ' . implode( ' ', $outputAttributes ) : '' ) . '>';
			},
			$html
		);
	}
}
