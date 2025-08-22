#!/bin/bash

# Performance Testing Script
echo "🚀 AI Survey Tool - Performance Analysis"
echo "========================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📊 Analyzing bundle size..."

# Build the application
echo "🔨 Building application..."
npm run build 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Check .next folder size
    if [ -d ".next" ]; then
        TOTAL_SIZE=$(du -sh .next | cut -f1)
        echo "📦 Total build size: $TOTAL_SIZE"
        
        # Check static folder size
        if [ -d ".next/static" ]; then
            STATIC_SIZE=$(du -sh .next/static | cut -f1)
            echo "📁 Static assets size: $STATIC_SIZE"
        fi
        
        # Check for large files
        echo "🔍 Largest files in build:"
        find .next -name "*.js" -type f -exec ls -lh {} + | sort -k5 -hr | head -5 | awk '{print "   " $9 " - " $5}'
    fi
else
    echo "❌ Build failed. Check for errors above."
fi

echo ""
echo "🎯 Performance Tips:"
echo "   • Dashboard should load in ~1-2 seconds"
echo "   • Analytics with lazy loading ~2-3 seconds"
echo "   • AI responses cached for 5 minutes"
echo "   • Anonymous surveys work without login"
echo ""
echo "🧪 Test URLs:"
echo "   • Home: http://localhost:3000"
echo "   • Dashboard: http://localhost:3000/dashboard (requires login)"
echo "   • Survey: http://localhost:3000/survey/[id] (no login needed)"
echo ""
echo "📈 Monitor performance in Chrome DevTools > Lighthouse"
