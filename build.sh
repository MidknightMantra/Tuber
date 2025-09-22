#!/bin/bash
echo "🏗️  Building Tuber..."
rm -rf dist
mkdir -p dist/css dist/js dist/images
cp src/index.html dist/
cp src/css/style.css dist/css/
cp src/js/script.js dist/js/
cp -r src/images/* dist/images/ 2>/dev/null || true
echo "✅ Built to dist/"
