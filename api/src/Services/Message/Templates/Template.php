<?php

namespace App\Services\Message\Templates;

class Template {
	public function __construct(
		public string $name,
		public string $subject,
		public string $body,
	) {
	}
}
