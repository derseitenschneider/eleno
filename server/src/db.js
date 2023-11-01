const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({
  path: `./config.env`,
});

const SUPABASE_URL = 'https://brhpqxeowknyhrimssxw.supabase.co';
const SERVICE_KEY = process.env.SERVICE_KEY;

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

module.exports = supabase;
