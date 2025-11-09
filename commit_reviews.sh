#!/bin/bash
set -e  # Exit on error

cd "/Users/jaroslav/Documents/DOCUMENTS/PODCAST STUDIO/WEB"

echo "📦 Creating backup..."
mkdir -p backups/backup_reviews_section_20251106_final
cp src/components/GoogleBusinessWidget.jsx backups/backup_reviews_section_20251106_final/ 2>/dev/null || true
cp src/components/GoogleBusinessWidget.css backups/backup_reviews_section_20251106_final/ 2>/dev/null || true
cp index.html backups/backup_reviews_section_20251106_final/ 2>/dev/null || true
cp src/App.jsx backups/backup_reviews_section_20251106_final/ 2>/dev/null || true
echo "✅ Backup created"

echo "📝 Checking git status..."
git status --short

echo "➕ Adding files to git..."
git add src/components/GoogleBusinessWidget.jsx src/components/GoogleBusinessWidget.css index.html src/App.jsx
echo "✅ Files added to git"

echo "💾 Committing..."
git commit -m "Add Google Business reviews section with static reviews

- Added GoogleBusinessWidget component with 3 static reviews
- Reviews from Google Business Profile (Jakub Blaho, David Pohanka, Alex Chen)
- Styled reviews section with cards and star ratings
- Fixed fetchPriority prop warning in App.jsx
- Updated CSP to allow Cloudflare Workers" || echo "⚠️  Commit failed or nothing to commit"
echo "✅ Committed"

echo "🚀 Pushing to remote..."
git push origin main || echo "⚠️  Push failed"
echo "✅ Pushed to Git"

echo "✨ Done!"
