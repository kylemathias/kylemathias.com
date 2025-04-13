<?php

$issue = htmlspecialchars($_POST['issue']);
$os = htmlspecialchars($_POST['os']);
$street1 = htmlspecialchars($_POST['street1']);
$street2 = htmlspecialchars($_POST['street2']);
$city = htmlspecialchars($_POST['city']);
$state = htmlspecialchars($_POST['state']);
$postalcode = htmlspecialchars($_POST['postalcode']);
$status = htmlspecialchars($_POST['status']);
$details = htmlspecialchars($_POST['details']);
$email = htmlspecialchars($_POST['email']);

$record = new SimpleXMLElement('<qdbapi></qdbapi>');
$field = $record->addChild('field',$issue);
$field->addAttribute('name','Issue');
$field = $record->addChild('field',$os);
$field->addAttribute('name','Operating_System');
$field = $record->addChild('field',$street1);
$field->addAttribute('name','Your_location__Street_1');
$field = $record->addChild('field',$street2);
$field->addAttribute('name','Your_location__Street_2');
$field = $record->addChild('field',$city);
$field->addAttribute('name','Your_location__City');
$field = $record->addChild('field',$state);
$field->addAttribute('name','Your_location__State_Region');
$field = $record->addChild('field',$postalcode);
$field->addAttribute('name','Your_location__Postal_Code');
$field = $record->addChild('field',$status);
$field->addAttribute('name','Status');
$field = $record->addChild('field',$details);
$field->addAttribute('name','Details');
$field = $record->addChild('field',$email);
$field->addAttribute('name','email');


include ($_SERVER['DOCUMENT_ROOT'].'/ninja/server/api.php');

$session = load_session();
$info = load_info();
$data = api_addrecord($session,$info,$record);
added_records($data);
$data = api_getrecordashtml($session,$info,$data);

echo $data;


?>