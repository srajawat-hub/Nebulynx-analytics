#!/bin/bash

echo "🚀 Nebulynx Analytics Deployment Script"
echo "======================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check if all changes are committed
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  You have uncommitted changes. Please commit them first:"
    echo "   git add ."
    echo "   git commit -m 'Prepare for deployment'"
    exit 1
fi

echo "✅ Repository is ready for deployment"
echo ""
echo "📋 Next Steps:"
echo "1. Push your code to GitHub:"
echo "   git push origin main"
echo ""
echo "2. Deploy to Render:"
echo "   - Go to https://render.com"
echo "   - Sign up/Login"
echo "   - Click 'New +' → 'Web Service'"
echo "   - Connect your GitHub repository"
echo "   - Use these settings:"
echo "     • Name: nebulynx-analytics"
echo "     • Environment: Node"
echo "     • Build Command: npm install && npm run build"
echo "     • Start Command: npm start"
echo "     • Plan: Free"
echo ""
echo "3. Wait for deployment (5-10 minutes)"
echo ""
echo "4. Share your live URL with friends! 🎉"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md" 