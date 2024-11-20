<?php

namespace App\Services;

use GuzzleHttp\Client;
use Stripe\Checkout\Session;
use Stripe\Invoice;

class SupabaseService
{
  private $_client;
  private $_config;

  public function __construct(array $config)
  {
    $this->_config = $config;
    $this->_client = new Client(
      array(
        'base_uri' => $this->_config['url'],
        'headers' => array(
          'apikey' => $this->_config['anon_key'],
          'Authorization' => 'Bearer ' . $this->_config['service_role_key'],
        ),
      )
    );

  }

  public function getLesson(string $homeworkKey)
  {
    $response = $this->_client->get(
      'rest/v1/lessons',
      array(
        'query' => array(
          'select' => '*,students(id,firstName),groups(id,name)',
          'homeworkKey' => 'eq.' . $homeworkKey,
        ),
      )
    );

    $data = json_decode($response->getBody(), true);
    return $data[0] ?? null;
  }


  public function handleCheckoutCompleted(Session $session): array {
    $userId = $session->client_reference_id;
    $isLifetime = empty($session->subscription);

    try {
      return $this->updateSubscription($userId, [
        'user_id' => $userId,
        'stripe_customer_id' => $session->customer,
        'stripe_subscription_id' => $session->subscription,
        'stripe_invoice_id' => $session->invoice,
        'payment_type' => $isLifetime ? 'lifetime' : 'subscription',
        'subscription_status' => $isLifetime ? 'lifetime' : 'active',
        'payment_status' => $session->payment_status,
        'amount' => $session->amount_total,
        'currency' => $session->currency
      ]);

    } catch (\Exception $e) {
      return ['error' => $e->getMessage()];
    }
  }


  public function updateSubscription(string $user_id, array $data): array
  {
    try {
      $response = $this->_client->request(
        'POST', //PATCH in future
        "{$this->_config['url']}/rest/v1/stripe_subscriptions", [
          // 'headers' => $this->headers,
          // 'query' => [
          //   'user_id' => 'eq.' . $user_id
          // ],
          'json' => $data
        ]
      );

      return [
        'success' => true,
        'data' => json_decode($response->getBody(), true)
      ];

    } catch (\Exception $e) {
      return ['error' => $e->getMessage()];
    }
  }
}
