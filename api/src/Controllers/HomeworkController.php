<?php

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Services\SupabaseService;

class HomeworkController
{
    private $supabase;

    public function __construct(SupabaseService $supabase)
    {
        $this->supabase = $supabase;
    }

    public function getHomework(Request $request, Response $response, array $args): Response
    {
        $entity_id = (int) $args['entity_id'];
        $homeworkKey = $args['homework_key'];

        try {
            $lesson = $this->supabase->getLesson($homeworkKey);


            if (!$lesson || ($entity_id !== $lesson['studentId'] && $entity_id !== $lesson['groupId'])) {
                return $this->renderError($response);
            }

            $formattedLesson = $this->formatLesson($lesson);

            $response->getBody()->write($this->renderView('homework', $formattedLesson));
            return $response->withHeader('Content-Type', 'text/html');
        } catch (\Exception $e) {
            return $this->renderError($response);
        }
    }

    private function formatLesson($lesson): array
    {
        return [
        'date' => $this->formatDate($lesson['date']),
        'entity_name' => $lesson['students']['firstName'] ?? $lesson['groups']['name'],
        'entity_type' => $lesson['students'] ? 's' : 'g',
        'homework' => $lesson['homework'] ?? '',
        ];
    }

    private function formatDate($date): string
    {
        $dateObj = new \DateTime($date);
        return $dateObj->format('d.m.y');
    }

    private function renderError(Response $response): Response
    {
        $response->getBody()->write($this->renderView('error'));
        return $response->withStatus(404)->withHeader('Content-Type', 'text/html');
    }

    private function renderView(string $view, array $data = []): string
    {
        extract($data);
        ob_start();
        include __DIR__ . "/../Views/{$view}.php";
        return ob_get_clean();
    }
}
