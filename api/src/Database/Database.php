<?php

namespace App\Database;

use App\Config\Config;
use Exception;
use Monolog\Logger;
use PgSql\Connection;

class Database {
	/** @var Connection $conn The postgres connection*/
	private $conn;

	/**
	 * Construct
	 *
	 * The class constructor.
	 *
	 * @param Config $config
	 *
	 * @throws \Exception Throws when psql connection fails.
	 */
	public function __construct( Config $config ) {
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
	/**
	 * Query
	 *
	 * Query the database.
	 *
	 * @param string $sql The sql query string with placeholders.
	 * @param array  $params An array of params to fill the placeholders.
	 */
	public function query( string $sql, array $params = array() ): array|false {
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

	/**
	 * Insert
	 *
	 * Insert data into the database.
	 *
	 * @param string $table The name of the table.
	 * @param array  $data An array with the data.
	 */
	public function insert( string $table, array $data ): bool {
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

	/**
	 * Update
	 *
	 * Update database rows.
	 *
	 * @param string $table The name of the database table.
	 * @param array  $data The data to be inserted.
	 * @param array  $where The query fields.
	 * @param string $operand Operand between the queryfields.
	 */
	public function update(
		string $table,
		array $data,
		array $where,
		string $operand = 'AND'
	): bool {
		$data         = $this->convertBooleansForPostgres( $data );
		$where        = $this->convertBooleansForPostgres( $where );
		$setClauses   = array();
		$whereClauses = array();
		$params       = array();
		$paramIndex   = 1;

		foreach ( $data as $key => $value ) {
			$setClauses[] = "$key = $" . ( $paramIndex++ );
			$params[]     = $value;
		}

		foreach ( $where as $key => $value ) {
			$whereClauses[] = "$key = $" . ( $paramIndex++ );
			$params[]       = $value;
		}

		$sql = "UPDATE {$table} SET "
			. implode( ', ', $setClauses )
			. ' WHERE '
			. implode( " {$operand} ", $whereClauses );

		$result = pg_query_params( $this->conn, $sql, $params );

		return $result ? true : false;
	}

	/**
	 * Delete
	 *
	 * Delete record from the database.
	 *
	 * @param string $table The database table name.
	 * @param array  $where The where clauses.
	 * @param string $operand The operand between the where clauses.
	 */
	public function delete(
		string $table,
		array $where,
		string $operand = 'AND'
	): bool {
		$where        = $this->convertBooleansForPostgres( $where );
		$whereClauses = array();
		$params       = array();
		$paramIndex   = 1;

		foreach ( $where as $key => $value ) {
			$whereClauses[] = "$key = $" . ( $paramIndex++ );
			$params[]       = $value;
		}

		$sql = "DELETE FROM {$table} WHERE " . implode( " {$operand} ", $whereClauses );

		$result = pg_query_params( $this->conn, $sql, $params );

		return $result ? true : false;
	}

	/**
	 * Convert booleans
	 *
	 * Converts psql boolean strings 't'|'f' to boolean values.
	 *
	 * @param array $row The database record that contains boolean strings.
	 * @return array The database record with booleans instead of boolean strings.
	 */
	private function convertBooleans( array $row ): array {
		foreach ( $row as $key => $value ) {
			if ( 't' === $value ) {
				$row[ $key ] = true;
			} elseif ( 'f' === $value ) {
				$row[ $key ] = false;
			}
		}
		return $row;
	}

	/**
	 * Convert booleans for postgres
	 *
	 * Converts booleans to boolean strings for postgres.
	 *
	 * @param array $data The data with booleans to be converted.
	 */
	private function convertBooleansForPostgres( array $data ): array {
		foreach ( $data as $key => $value ) {
			if ( is_bool( $value ) ) {
				$data[ $key ] = $value ? 't' : 'f';
			}
		}
		return $data;
	}
}
