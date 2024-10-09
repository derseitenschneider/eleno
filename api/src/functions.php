<?php
function dd($var)
{
    echo '<pre>';
    var_dump($var);
    echo '</pre>';

}

function lv($variable, $log_file = 'debug.log') 
{
    $file_handle = fopen($log_file, 'a');

    if ($file_handle === false) {
        throw new Exception("Unable to open log file: $log_file");
    }

    $time_stamp = date('Y-m-d H:i:s');

    $type = gettype($variable);

    $log_message = "[{$time_stamp} Type: {$type}\n]";

    switch($type){
    case 'array':
    case 'object':
        $log_message .= print_r($variable, true);
        break;
    case 'resource':
        $log_message .="Resource ID:" . intval($variable) . "\n";
        break;
    case 'boolean':
        $log_message.=($variable ? 'true' : 'false') . "\n";
        break;
    case 'NULL':
        $log_message .= "NULL\n";
        break;
    default:
        $log_message.=var_export($variable, true) . "\n";
    }

    $log_message .= "\n";

    fwrite($file_handle, $log_message);
    fclose($file_handle);
}
