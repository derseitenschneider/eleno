<?php

namespace App\Services;

use GuzzleHttp\Client;

class SupabaseService
{
    private $client;
    private $config;

    public function __construct(array $config)
    {
        $this->config = $config;
        $this->client = new Client(
            [
            'base_uri' => $this->config['url'],
            'headers' => [
                'apikey' => $this->config['anon_key'],
                'Authorization' => 'Bearer ' . $this->config['service_role_key'],
            ],
            ]
        );
    }

    public function getLesson(string $homeworkKey)
    {
        $response = $this->client->get(
            'rest/v1/lessons', [
            'query' => [
                'select' => '*,students(id,firstName),groups(id,name)',
                'homeworkKey' => 'eq.' . $homeworkKey,
            ],
            ]
        );

        $data = json_decode($response->getBody(), true);
        return $data[0] ?? null;
    }

    // Add more methods for interacting with Supabase as needed
}
