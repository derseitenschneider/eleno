<?php

namespace App\Services;

use GuzzleHttp\Client;
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

    // Get product
    public function getProduct(string $stripe_product_id)
    {
        $product = $this->_client->get(
            'rest/v1/products',
            array('query' => array(
            'select' => '*',
            'stripe_product_id' => $stripe_product_id
            ))
        );

        return $product;
    }

    // Get user
    public function isSubscription($product)
    {
        if ($product->type === 'subscription') {
            return true;
        }
        return false;
    }

    // Set stripe_customer
    public function createStripeCustomer(string $user_id, string $stripe_customer_id)
    {
        $res =  $this->_client->post(
            'rest/v1/stripe_customers',
            array('body' => json_encode(
                array(
                'user_id' => $user_id,
                'stripe_customer_id' => $stripe_customer_id
                )
            ))
        );
    }

    public function createPayment( Invoice $invoice)
    {
        $res = $this->_client->post(
            'rest/v1/rpc/handle_invoice_paid',
            array(
            'json' => array( 'invoice_data' => $invoice)            
            )
        );
    }

    // Set subscription
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
