<?php

return [
    'supabase' => [
        'url' => $_ENV['SUPABASE_URL'],
        'anon_key' => $_ENV['SUPABASE_ANON_KEY'],
        'service_role_key' => $_ENV['SUPABASE_SERVICE_ROLE_KEY'],
    ],
    // Add other configuration settings here
];
