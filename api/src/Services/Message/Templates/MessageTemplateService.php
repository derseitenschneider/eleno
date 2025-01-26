<?php
namespace App\Services\Message\Templates;

use App\Services\SupabaseService;

class MessageTemplateService {
	public function __construct(
		private SupabaseService $supabase
	) {}

	public function getTemplate( string $templateName ): Template {
		$template = $this->supabase->get(
			'message_templates',
			array(
				'name' => 'eq.' . $templateName,
			)
		);
		return new Template(
			$templateName,
			$template['data'][0]['subject'],
			$template['data'][0]['body'],
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
