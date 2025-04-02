<?php
namespace App\Services\Message\Templates;

use App\Database\Database;

class MessageTemplateService {
	/**
	 * Construct
	 *
	 * The class constructor.
	 *
	 * @param Database $db
	 */
	public function __construct( private Database $db ) {}

	/**
	 * Get template
	 *
	 * Retrieves the template from the database.
	 *
	 * @param string $templateName
	 */
	public function getTemplate( string $templateName ): Template {
		$sql = <<<SQL
		SELECT *
		FROM message_templates
		WHERE name = $1
		SQL;

		$template = $this->db->query( $sql, [ $templateName ] );

		return new Template(
			$templateName,
			$template[0]['subject'],
			$template[0]['body'],
		);
	}

	/**
	 * Fill template
	 *
	 * Fills the template placeholders with given data.
	 *
	 * @param Template $template
	 * @param array    $data
	 */
	public function fillTemplate( Template $template, array $data ): Template {
		foreach ( $data as $key => $val ) {
			$template->subject = str_replace( $key, $val, $template->subject );
			$template->body    = str_replace( $key, $val, $template->body );
		}
		return $template;
	}
}
