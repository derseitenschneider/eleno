<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
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

    /**
     * Complete checkout
     *
     * @param Session $session 
     */
    public function completeCheckout(Session $session)
    {
        logDebug($session);
        $res =  $this->_client->post(
            'rest/v1/rpc/handle_checkout_completed',
            array(
            'json' => array('session_data' => $session)
            )
        );
    }

    /**
     *  Create payment
     *
     * @param Invoice $invoice 
     */
    public function createPayment( Invoice $invoice)
    {
        $res = $this->_client->post(
            'rest/v1/rpc/handle_invoice_paid',
            array(
            'json' => array( 'invoice_data' => $invoice)            
            )
        );
    }

    /**
     * Create subscription
     *
     * @param mixed $args 
     */
    public function createSubscription( $args)
    {
        $res =  $this->_client->post(
            'rest/v1/rpc/handle_subscription_created',
            array(
            'json' => array( 'subscription_data' => $args)
            )
        );

    }
}
