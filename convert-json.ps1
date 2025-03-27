# Define paths
$jsonPath = ".\data.json"
$csvPath = ".\data.csv"

# Read the JSON content
$jsonContent = Get-Content $jsonPath -Raw | ConvertFrom-Json

# Export to CSV
$jsonContent | Export-Csv -Path $csvPath -NoTypeInformation

Write-Host "Conversion complete: data.csv created."
