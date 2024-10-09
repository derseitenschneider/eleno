<?php

return array(
    'supabase' => array(
        'url' => $_ENV['SUPABASE_URL'],
        'anon_key' => $_ENV['SUPABASE_ANON_KEY'],
        'service_role_key' => $_ENV['SUPABASE_SERVICE_ROLE_KEY'],
    ),
    'stripe' => array(
        'secret_key' => $_ENV['STRIPE_SECRET_KEY']
    )
);
