#!/bin/bash

OUTPUT_FILE="grow_platform_complete_$(date +%Y%m%d_%H%M%S).txt"

echo "📦 Export du projet GROW Platform - $(date)" > "$OUTPUT_FILE"
echo "==============================================" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# 1. Arborescence complète
echo "🌿 ARBORESCENCE DU PROJET" >> "$OUTPUT_FILE"
echo "-------------------------" >> "$OUTPUT_FILE"
find . -type f -not -path "*/node_modules/*" -not -path "*/venv/*" -not -path "*/__pycache__/*" -not -path "*/.git/*" -not -name "*.log" -not -name "*.pyc" | sort >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# 2. Frontend (React)
echo "📁 FRONTEND (React)" >> "$OUTPUT_FILE"
echo "-------------------" >> "$OUTPUT_FILE"
for file in $(find grow-frontend/src -type f -name "*.js" -o -name "*.jsx" -o -name "*.css" 2>/dev/null | sort); do
    echo "" >> "$OUTPUT_FILE"
    echo "📄 FILE: $file" >> "$OUTPUT_FILE"
    echo "----------------------------------------" >> "$OUTPUT_FILE"
    cat "$file" 2>/dev/null >> "$OUTPUT_FILE"
done

# 3. Backend (Flask)
echo "" >> "$OUTPUT_FILE"
echo "📁 BACKEND (Flask)" >> "$OUTPUT_FILE"
echo "------------------" >> "$OUTPUT_FILE"
for file in $(find grow-backend -type f -name "*.py" -not -path "*/venv/*" -not -path "*/__pycache__/*" 2>/dev/null | sort); do
    echo "" >> "$OUTPUT_FILE"
    echo "📄 FILE: $file" >> "$OUTPUT_FILE"
    echo "----------------------------------------" >> "$OUTPUT_FILE"
    cat "$file" 2>/dev/null >> "$OUTPUT_FILE"
done

# 4. Fichiers de configuration
echo "" >> "$OUTPUT_FILE"
echo "📁 FICHIERS DE CONFIGURATION" >> "$OUTPUT_FILE"
echo "---------------------------" >> "$OUTPUT_FILE"
for file in package.json vercel.json .gitignore .env.example; do
    if [ -f "$file" ]; then
        echo "" >> "$OUTPUT_FILE"
        echo "📄 FILE: $file" >> "$OUTPUT_FILE"
        echo "----------------------------------------" >> "$OUTPUT_FILE"
        cat "$file" 2>/dev/null >> "$OUTPUT_FILE"
    fi
done

echo "" >> "$OUTPUT_FILE"
echo "✅ Export terminé ! Fichier : $OUTPUT_FILE" >> "$OUTPUT_FILE"
echo ""
echo "✅ Export terminé ! Fichier : $OUTPUT_FILE"
