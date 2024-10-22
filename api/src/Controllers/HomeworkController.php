<?php

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Services\SupabaseService;

class HomeworkController
{
    private $_supabase;

    public function __construct(SupabaseService $supabase)
    {
        $this->_supabase = $supabase;
    }

    public function getHomework(
        Request $request, Response $response, array $args
    ): Response {
        $entity_id = (int) $args['entity_id'];
        $homeworkKey = $args['homework_key'];

        try {
            $lesson = $this->_supabase->getLesson($homeworkKey);


            if (!$lesson 
                || ($entity_id !== $lesson['studentId'] 
                && $entity_id !== $lesson['groupId'])
            ) {
                return $this->_renderError($response);
            }

            $formattedLesson = $this->_formatLesson($lesson);

            $response->getBody()->write(
                $this->_renderView('homework', $formattedLesson)
            );

            return $response->withHeader('Content-Type', 'text/html');
        } catch (\Exception $e) {
            return $this->_renderError($response);
        }
    }

    private function _formatLesson($lesson): array
    {
        return [
        'date' => $this->_formatDate($lesson['date']),
        'entity_name' => $lesson['students']['firstName'] 
        ?? $lesson['groups']['name'],
        'entity_type' => $lesson['students'] ? 's' : 'g',
        'homework' => $lesson['homework'] ?? '',
        ];
    }

    private function _formatDate($date): string
    {
        $dateObj = new \DateTime($date);

        return $dateObj->format('d.m.y');
    }

    private function _renderError(Response $response): Response
    {
        $response->getBody()->write($this->_renderView('error'));

        return $response->withStatus(404)->withHeader(
            'Content-Type', 'text/html'
        );
    }

    private function _renderView(string $view, array $data = []): string
    {
        extract($data);
        ob_start();
        include __DIR__ . "/../Views/{$view}.php";
        return ob_get_clean();
    }
}
