$body = "Testing ntfy.sh from my E-com project!"
$topic = "my_ecom_test_$(Get-Random)"
$url = "https://ntfy.sh/$topic"

Write-Host "Sending notification to: $url" -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "text/plain"
    Write-Host "Success! Notification sent." -ForegroundColor Green
    Write-Host "You can view it at: https://ntfy.sh/$topic" -ForegroundColor Yellow
} catch {
    Write-Error "Failed to send notification: $_"
}
