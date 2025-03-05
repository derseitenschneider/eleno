<?php
$entity_type  = $entity_type ?? '';
$related_name = $related_name ?? '';
$homework     = $homework ?? '';
$date         = $date ?? date( 'Y-m-d' );

$pre_text = '';
if ( 's' === $entity_type ) {
	$pre_text = 'Hier sind deine Hausaufgaben:';
} else {
	$pre_text = 'Hier sind eure Hausaufgaben:';
}
$related_name = $related_name || '';
$homework     = $homework || '';

$content = <<<HTML
<section class="section">
    <h2 class="heading-2">Hausaufgaben vom {$date}</h2>
    <p>Hallo {$related_name}</p>
    <p>{$pre_text}</p>
    <div class="homework">{$homework}</div>
    <p>Viel Spass und bis zum nächsten Mal.</p>
</section>
HTML;

require __DIR__ . '/base.php';
