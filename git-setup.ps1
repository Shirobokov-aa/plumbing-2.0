param (
    [Parameter(Mandatory=$true)]
    [string]$url
)

# Check if git is installed and available
try {
    $gitVersion = git --version
    Write-Host "Git found: $gitVersion"
} catch {
    Write-Error "Git is not installed or not in PATH. Please install Git and try again."
    exit 1
}

# Check if current directory is a git repository
if (-not (Test-Path -Path ".git" -PathType Container)) {
    Write-Error "Current directory is not a Git repository. Please initialize a Git repository first (git init)."
    exit 1
}

try {
    # Add remote origin
    Write-Host "Adding remote origin: $url"
    git remote add origin $url
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to add remote origin"
    }

    # Rename branch to main
    Write-Host "Renaming current branch to 'main'"
    git branch -M main
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to rename branch"
    }

    # Push to remote with upstream tracking
    Write-Host "Pushing to remote repository..."
    git push -uf origin main
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to push to remote repository"
    }

    Write-Host "Successfully configured remote origin and pushed to 'main' branch." -ForegroundColor Green
} catch {
    Write-Error $_
    exit 1
}
