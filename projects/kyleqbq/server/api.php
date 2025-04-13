<?php

function load_session(){
	$session = simplexml_load_file(__DIR__ . '/session.xml');
	return $session;
}

function load_info(){
	$info = simplexml_load_file(__DIR__ . '/info.xml');
	return $info;
}

function added_records($data){
	$file = fopen(__DIR__ . "/added_records.xml","a");
	fwrite($file,$data->asXML());
	fclose($file);
}

function api_authenticate($credentials, $domain){

$xml = $credentials;
$xml = $xml->asXML();

$url = 'https://'.$domain.'.quickbase.com/db/main';

$headers = array(
			'Content-Type: application/xml',
			'Content-Length: ' . strlen($xml),
			'QUICKBASE-ACTION: API_Authenticate',
);

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_POSTFIELDS, $xml);

$response = curl_exec($ch);
$response = simplexml_load_string($response);
return $response;

}

function api_addrecord($session,$info,$record){

$ticket 	= $session->ticket;
$domain 	= $info->domain;
$apptoken 	= $info->apptoken;
$dbid 		= $info->dbid;

$xml = $record;
$xml->addChild('ticket',$ticket);
$xml->addChild('apptoken',$apptoken);
$xml = $xml->asXML();

$url = 'https://'.$domain.'.quickbase.com/db/'.$dbid;

$headers = array(
			'Content-Type: application/xml',
			'Content-Length: ' . strlen($xml),
			'QUICKBASE-ACTION: API_AddRecord',
);

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_POSTFIELDS, $xml);

$response = curl_exec($ch);
$response = simplexml_load_string($response);
return $response;

}

function api_getrecordashtml($session,$info,$data){

$ticket 	= $session->ticket;
$domain 	= $info->domain;
$apptoken 	= $info->apptoken;
$dbid 		= $info->dbid;
$rid		= $data->rid;

$xml = new SimpleXMLElement('<qdbapi></qdbapi>');
$xml->addChild('ticket',$ticket);
$xml->addChild('apptoken',$apptoken);
$xml->addChild('rid',$rid);
$xml = $xml->asXML();

$url = 'https://'.$domain.'.quickbase.com/db/'.$dbid;

$headers = array(
			'Content-Type: application/xml',
			'Content-Length: ' . strlen($xml),
			'QUICKBASE-ACTION: API_GetRecordAsHTML',
);

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_POSTFIELDS, $xml);

$response = curl_exec($ch);
return $response;

}

//do query to QuickBase returning all entries with a specific email
function API_DoQueryEmail($session, $info, $email){
		
		$ticket 	= $session->ticket;		
		$apptoken 	= $info->apptoken;
		$query		= '{'."'".'17'."'".'.EX.'."'".$email."'".'}';
		
		echo '$query' . $query;
		echo "<br>";
		
		$dbid 		= $info->dbid;
		$domain 	= $info->domain;
		$url = 'https://'.$domain.'.quickbase.com/db/'.$dbid;
		
		//bulding xml request
		$xml = new SimpleXMLElement('<qdbapi></qdbapi>');
		$xml->addChild('ticket',$ticket);
		$xml->addChild('apptoken',$apptoken);
		$xml->addChild('query', $query);
		$xml = $xml->asXML();
		
		$headers = array(
			'Content-Type: application/xml',
			'Content-Length: ' . strlen($xml),
			'QUICKBASE-ACTION: API_DoQuery',
		);
		
		
		
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_POST, true);
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $xml);

		$response = curl_exec($ch);
		
		return $response;
	}	


?>