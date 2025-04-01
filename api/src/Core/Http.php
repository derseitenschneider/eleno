<?php
namespace App\Core;

use InvalidArgumentException;
use Psr\Http\Message\ResponseInterface as Response;
use RuntimeException;

class Http {
	/**
	 * Json Response
	 *
	 * Build a simple json response.
	 *
	 * @param Response $response
	 * @param array    $data
	 * @param int      $status
	 *
	 * @throws RuntimeException Throws when json is invalid.
	 * @throws InvalidArgumentException Throws when args ar invalid.
	 */
	public static function jsonResponse(
		Response $response,
		array $data = array(
			'status' => 'success',
			'data'   => null,
		),
		int $status = 200
	): Response {
		$response->getBody()->write( json_encode( $data ) );
		return $response->withStatus( $status )
						->withHeader( 'Content-Type', 'application/json' );
	}

	/**
	 * Error Response
	 *
	 * Create a error response.
	 *
	 * @param Response $response
	 * @param string   $message
	 * @param int      $status
	 *
	 * @throws RuntimeException  Throws when json is invalid.
	 * @throws InvalidArgumentException  Throws when data is invalid.
	 */
	public static function errorResponse( Response $response, string $message, int $status = 404 ): Response {
		return self::jsonResponse(
			$response,
			array(
				'status'  => 'error',
				'message' => $message,
			),
			$status
		);
	}
}
