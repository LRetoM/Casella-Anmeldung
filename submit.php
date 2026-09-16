<?php

header('Content-Type: application/json; charset=utf-8');

$empfaenger  = 'philip.moeller@icig-bs.com';
$absender    = 'test@icig-bs.com';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || empty($input['vorname']) || empty($input['nachname']) || empty($input['firma']) || empty($input['geburtsdatum']) || empty($input['pdfBase64'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Unvollständige Daten']);
    exit;
}

$vorname      = trim($input['vorname']);
$nachname     = trim($input['nachname']);
$geburtsdatum = trim($input['geburtsdatum']);
$firma        = trim($input['firma']);
$pdfBase64    = $input['pdfBase64'];

$pdfData = base64_decode($pdfBase64, true);
if ($pdfData === false) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'PDF ungültig']);
    exit;
}

$dateiname = 'Anmeldung_' . preg_replace('/[^a-zA-Z0-9_-]/', '_', $nachname) . '_' . date('Y-m-d_His') . '.pdf';

$ablageOrdner = __DIR__ . '/anmeldungen';
if (!is_dir($ablageOrdner)) {
    mkdir($ablageOrdner, 0755, true);
}
file_put_contents($ablageOrdner . '/' . $dateiname, $pdfData);

$boundary = md5(uniqid((string)time(), true));

$geburtsdatumFormatiert = date('d.m.Y', strtotime($geburtsdatum));

$body  = "Neue Anmeldung eingegangen!\n\n";
$body .= "Vorname: {$vorname}\n";
$body .= "Nachname: {$nachname}\n";
$body .= "Unternehmen: {$firma}\n";
$body .= "Geburtsdatum: {$geburtsdatumFormatiert}\n";
$body .= "\nDas vollständige Anmeldeformular befindet sich im Anhang!";

$message  = "--{$boundary}\r\n";
$message .= "Content-Type: text/plain; charset=UTF-8\r\n";
$message .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
$message .= $body . "\r\n\r\n";

$message .= "--{$boundary}\r\n";
$message .= "Content-Type: application/pdf; name=\"{$dateiname}\"\r\n";
$message .= "Content-Transfer-Encoding: base64\r\n";
$message .= "Content-Disposition: attachment; filename=\"{$dateiname}\"\r\n\r\n";
$message .= chunk_split(base64_encode($pdfData)) . "\r\n";

$message .= "--{$boundary}--";

$subject = '=?UTF-8?B?' . base64_encode('Neue Anmeldung von ' . $vorname . ' ' . $nachname) . '?=';

$headers  = "From: Anmeldeformular <{$absender}>\r\n";
$headers .= "Reply-To: {$absender}\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: multipart/mixed; boundary=\"{$boundary}\"\r\n";

$erfolg = mail($empfaenger, $subject, $message, $headers);

if ($erfolg) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'mail() konnte die Nachricht nicht senden']);
}