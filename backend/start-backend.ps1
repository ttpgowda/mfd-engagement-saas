# Backend Startup Script with Environment Variables
# This script loads environment variables from the 'env' file and starts the backend

$separator = '============================================'
Write-Host $separator -ForegroundColor Cyan
Write-Host "  Starting Backend Application" -ForegroundColor Cyan
Write-Host $separator -ForegroundColor Cyan
Write-Host ""

# Set JAVA_HOME
$javaPath = "C:\Program Files\Java\jdk-17"
if (Test-Path $javaPath) {
    $env:JAVA_HOME = $javaPath
    $env:PATH = "$javaPath\bin;$env:PATH"
    $javaHomeMsg = "JAVA_HOME set: $env:JAVA_HOME"
    Write-Host ('✓ ' + $javaHomeMsg) -ForegroundColor Green
} else {
    $javaErrorMsg = "ERROR: Java not found at $javaPath"
    Write-Host ('✗ ' + $javaErrorMsg) -ForegroundColor Red
    exit 1
}

# Load environment variables from env file
$envFile = Join-Path $PSScriptRoot "env"
if (Test-Path $envFile) {
    $loadingMsg = 'Loading environment variables from env file'
    Write-Host ('✓ ' + $loadingMsg) -ForegroundColor Green
    Get-Content $envFile | ForEach-Object {
        $line = $_.Trim()
        # Skip empty lines and comments
        if ($line -and -not $line.StartsWith('#')) {
            # Handle both = and : as separators
            $separatorIndex = -1
            if ($line.Contains('=')) {
                $separatorIndex = $line.IndexOf('=')
            } elseif ($line.Contains(':')) {
                $separatorIndex = $line.IndexOf(':')
            }
            
            if ($separatorIndex -gt 0) {
                $key = $line.Substring(0, $separatorIndex).Trim()
                $value = $line.Substring($separatorIndex + 1).Trim()
                # Remove quotes if present
                if ($value.Length -ge 2) {
                    if (($value.StartsWith('"') -and $value.EndsWith('"')) -or 
                        ($value.StartsWith("'") -and $value.EndsWith("'"))) {
                        $value = $value.Substring(1, $value.Length - 2)
                    }
                }
                # Set environment variable (handle special characters properly)
                [System.Environment]::SetEnvironmentVariable($key, $value, [System.EnvironmentVariableTarget]::Process)
                # Mask password values for display
                $displayValue = if ($key -match 'PASSWORD|SECRET') { '***' } else { $value }
                $envVarMsg = "  $key = $displayValue"
                Write-Host ('✓' + $envVarMsg) -ForegroundColor Gray
            }
        }
    }
    Write-Host ""
} else {
    $warningMsg1 = 'WARNING: env file not found. Setting default values'
    $warningMsg2 = '  You may need to set environment variables manually.'
    Write-Host ('✗ ' + $warningMsg1) -ForegroundColor Yellow
    Write-Host $warningMsg2 -ForegroundColor Yellow
    Write-Host ""
    
    # Set default values (you can modify these)
    $env:DATASOURCE_URL = "localhost:5432"
    $env:DATASOURCE_DATABASE = "mf_db_new"
    $env:DATASOURCE_USERNAME = "postgres"
    $env:DATASOURCE_PASSWORD = "root"
    $env:JWT_SECRET = "3dd9996f5f618e07ca98215905fc608e1a243bb3509cd2821189fa9536213c2f"
    $env:MAIL_HOST = "smtpout.secureserver.net"
    $env:MAIL_PORT = "587"
    $env:MAIL_USERNAME = "info@thewealthweb.in"
    $env:MAIL_PASSWORD = 'Jx/*UpS4x&VvYL.'
    $env:MAIL_FROM = "info@thewealthweb.in"
}

# Verify Java
$verifyJavaMsg = 'Verifying Java installation'
Write-Host $verifyJavaMsg -ForegroundColor Cyan
$javaVersion = java -version 2>&1 | Select-Object -First 1
Write-Host "  $javaVersion" -ForegroundColor Gray
Write-Host ""

# Check if PostgreSQL might be running (optional check)
$checkPrereqMsg = 'Checking prerequisites'
Write-Host $checkPrereqMsg -ForegroundColor Cyan
Write-Host "  ℹ Make sure PostgreSQL is running on port 5432" -ForegroundColor Yellow
Write-Host "  ℹ Database should be: $env:DATASOURCE_DATABASE" -ForegroundColor Yellow
Write-Host ""

# Navigate to backend directory
Set-Location $PSScriptRoot

# Check if Maven wrapper exists
if (-not (Test-Path ".\mvnw.cmd")) {
    $errorMsg = 'ERROR: mvnw.cmd not found in backend directory'
    Write-Host ('✗ ' + $errorMsg) -ForegroundColor Red
    exit 1
}

# Start the application
$separator2 = '============================================'
$startingMsg = '  Starting Spring Boot Application'
Write-Host $separator2 -ForegroundColor Cyan
Write-Host $startingMsg -ForegroundColor Cyan
Write-Host $separator2 -ForegroundColor Cyan
Write-Host ""
$backendUrl = 'http://localhost:8080'
$swaggerUrl = 'http://localhost:8080/swagger-ui.html'
Write-Host ('Backend will be available at: ' + $backendUrl) -ForegroundColor Green
Write-Host ('API Docs (Swagger): ' + $swaggerUrl) -ForegroundColor Green
Write-Host ""
$stopMsg = 'Press Ctrl+C to stop the application'
Write-Host $stopMsg -ForegroundColor Yellow
Write-Host ""

.\mvnw.cmd spring-boot:run
