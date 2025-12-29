@echo off
echo Configuring Git identity...
git config user.email "builder@yearbook.com"
git config user.name "Yearbook Builder"

echo Initializing Git repository...
git init

echo Adding files...
git add .

echo Committing files...
git commit -m "Deploy: Full Yearbook Project"

echo Renaming branch to main...
git branch -M main

echo Adding remote origin...
git remote add origin https://github.com/Rucarido/Open-Source-Yearbook

echo Force pushing to remote...
git push -f -u origin main

echo Done.
pause
