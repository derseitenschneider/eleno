<?php
function getProfile( string $userId, App\Database\Database $db ) {
	echo 'Fetching profile from database';

	$sql =
		' 
		SELECT *
		FROM profiles
		WHERE id = $1
		';

	$params      = [ $userId ];
	$userProfile = $db->query( $sql, $params );

	echo "Found user profile\n\n";
	// echo json_encode( $userProfile, JSON_PRETTY_PRINT ) . "\n\n";
	return $userProfile[0];
}
