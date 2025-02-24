<?php

namespace App\Database;

use App\Config\Config;
use Monolog\Logger;

class Database {
	private $conn;

	public function __construct( private Config $config ) {
		$connectionString = "
        host={$config->supabaseHost} 
        port={$config->supabasePort} 
        dbname={$config->subapaseDbName}
        user={$config->supabaseUser} 
        password={$config->supabasePassword}
        ";

		$this->conn = pg_connect( $connectionString );

		if ( ! $this->conn ) {
			throw new \Exception( 'Failed to connect to Postgres' );
		}
	}
	public function query( string $sql, array $params = array() ) {
		$result = pg_query_params( $this->conn, $sql, $params );
		if ( $result ) {
			$rows = array();
			while ( $row = pg_fetch_assoc( $result ) ) {
				$rows[] = $this->convertBooleans( $row );
			}
			pg_free_result( $result );
			return $rows;
		} else {
			return false;
		}
	}

	public function insert( string $table, array $data ) {
		$data         = $this->convertBooleansForPostgres( $data );
		$columns      = implode( ', ', array_keys( $data ) );
		$placeholders = implode(
			', ',
			array_map(
				function ( $i ) {
					return '$' . ( $i + 1 );
				},
				range( 0, count( $data ) - 1 )
			)
		);
		$values       = array_values( $data );

		$sql    = "INSERT INTO {$table} ({$columns}) VALUES ({$placeholders})";
		$result = pg_query_params( $this->conn, $sql, $values );

		return $result ? true : false;
	}

	public function update(
		string $table,
		array $data,
		array $where,
		string $operand = 'AND'
	) {
		$data         = $this->convertBooleansForPostgres( $data );
		$where        = $this->convertBooleansForPostgres( $where );
		$setClauses   = array();
		$whereClauses = array();
		$params       = array();
		$paramIndex   = 1;

		foreach ( $data as $key => $value ) {
			$setClauses[] = "$key = $" . $paramIndex++;
			$params[]     = $value;
		}

		foreach ( $where as $key => $value ) {
			$whereClauses[] = "$key = $" . $paramIndex++;
			$params[]       = $value;
		}

		$sql = "UPDATE {$table} SET "
			. implode( ', ', $setClauses )
			. ' WHERE '
			. implode( " {$operand} ", $whereClauses );

		$result = pg_query_params( $this->conn, $sql, $params );

		return $result ? true : false;
	}

	public function delete(
		string $table,
		array $where,
		string $operand = 'AND'
	) {
		$where        = $this->convertBooleansForPostgres( $where );
		$whereClauses = array();
		$params       = array();
		$paramIndex   = 1;

		foreach ( $where as $key => $value ) {
			$whereClauses[] = "$key = $" . $paramIndex++;
			$params[]       = $value;
		}

		$sql = "DELETE FROM {$table} WHERE " . implode( " {$operand} ", $whereClauses );

		$result = pg_query_params( $this->conn, $sql, $params );

		return $result ? true : false;
	}

	private function convertBooleans( array $row ): array {
		foreach ( $row as $key => $value ) {
			if ( $value === 't' ) {
				$row[ $key ] = true;
			} elseif ( $value === 'f' ) {
				$row[ $key ] = false;
			}
		}
		return $row;
	}

	private function convertBooleansForPostgres( array $data ): array {
		foreach ( $data as $key => $value ) {
			if ( is_bool( $value ) ) {
				$data[ $key ] = $value ? 't' : 'f';
			}
		}
		return $data;
	}

	public function __destruct() {
		pg_close( $this->conn );
	}
}
