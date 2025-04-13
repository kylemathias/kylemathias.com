<?php

include 'api.php';

$credentials = simplexml_load_file('api_authenticate.xml');
$session = api_authenticate($credentials,'seabrook');
$file = fopen("session.xml","w");
fwrite($file,$session->asXML());
fclose($file);



?>