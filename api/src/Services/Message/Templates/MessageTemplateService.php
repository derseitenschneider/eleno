<?php
namespace App\Services\Message\Templates;

use App\Database\Database;

class MessageTemplateService {
	public function __construct(
		private Database $db
	) {}

	public function getTemplate( string $templateName ): Template {
		$sql = '
            SELECT *
            FROM message_templates
            WHERE name = $1
        ';

		$template = $this->db->query( $sql, [ $templateName ] );

		return new Template(
			$templateName,
			$template[0]['subject'],
			$template[0]['body'],
		);
	}

	public function fillTemplate( Template $template, array $data ): Template {
		foreach ( $data as $key => $val ) {
			$template->subject = str_replace( $key, $val, $template->subject );
			$template->body    = str_replace( $key, $val, $template->body );
		}
		return $template;
	}
}
