<?php
namespace App\Core;

use Psr\Http\Message\ResponseInterface as Response;

class Http {
	public static function jsonResponse( Response $response, array $data, int $status = 200 ): Response {
		$response->getBody()->write( json_encode( $data ) );
		return $response->withStatus( $status )
						->withHeader( 'Content-Type', 'application/json' );
	}

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
