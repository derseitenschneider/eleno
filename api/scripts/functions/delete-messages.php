<?php
function deleteMessages( string $userId, App\Database\Database $db ) {
	echo 'Deleting old messages from user';
	$sql =
		' 
		DELETE
		FROM messages
		WHERE recipient = $1
		';

	$params      = [ $userId ];
	$userProfile = $db->query( $sql, $params );

	echo "Messages deleted. \n\n";
}
