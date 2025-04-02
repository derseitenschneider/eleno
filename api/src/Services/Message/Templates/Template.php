<?php

namespace App\Services\Message\Templates;

class Template {

	/**
	 * Construct
	 *
	 * The class constructor.
	 *
	 * @param string $name
	 * @param string $subject
	 * @param string $body
	 */
	public function __construct(
		public string $name,
		public string $subject,
		public string $body,
	) {
	}
}
