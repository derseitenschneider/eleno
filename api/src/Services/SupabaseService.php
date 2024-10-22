<?php

namespace App\Services;

use GuzzleHttp\Client;

class SupabaseService
{
    private $_client;
    private $_config;

    public function __construct(array $config)
    {
        $this->_config = $config;
        $this->_client = new Client(
            [
            'base_uri' => $this->_config['url'],
            'headers' => [
                'apikey' => $this->_config['anon_key'],
                'Authorization' => 'Bearer ' . $this->_config['service_role_key'],
            ],
            ]
        );
    }

    public function getLesson(string $homeworkKey)
    {
        $response = $this->_client->get(
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

    // Get product
    public function getProduct(string $stripe_product_id)
    {
        $product = $this->_client->get(
            'rest/v1/products', 
            array('query' => array('select' => '*', 'stripe_product_id' => $stripe_product_id))
        );

        return $product;
    }

    // Get user

    public function isSubscription($product)
    {
        if($product->type === 'subscription') {  

            return true;
        }
        
        return false; 

    }

    // Set stripe_customer
    public function createStripeCustomer(string $user_id, string $stripe_customer_id)
    {
        $res=  $this->_client->post(
            'rest/v1/stripe_customers',
            array('body' =>json_encode(
                array(
                'user_id' => $user_id,
                'stripe_customer_id' => $stripe_customer_id
                )
            ))
        );

        logDebug($res);
    }

    public function createPayment(
        string $stripe_customer_id,
        string $stripe_invoice_id,
        string $stripe_product_id,
        int $amount,
        string $currency,
        string $status,
    ) {
        $res = $this->_client->post(
            'rest/v1/payments',
            array(
            'body' => json_encode(
                array(
                'stripe_customer_id' => $stripe_customer_id,
                'stripe_invoice_id' => $stripe_invoice_id,
                'stripe_product_id' => $stripe_product_id,
                'amount' => $amount,
                'currency' => $currency,
                'status' => $status,
                )
            )
            )
        );
        logDebug($res);

    }

    // Set subscription
}
