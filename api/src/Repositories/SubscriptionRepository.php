<?php
namespace App\Repositories;

use Supabase\CreateClient;

class SubscriptionRepository
{

    protected $db;
    public function __construct(CreateClient $db_client)
    {
        $this->db = new $db_client();

    }
}
