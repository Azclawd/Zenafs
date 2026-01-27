#!/bin/bash

# Script to apply database migration to Supabase

echo "🔄 Applying database migration..."

# Get Supabase credentials from .env.local
SUPABASE_URL=$(grep NEXT_PUBLIC_SUPABASE_URL .env.local | cut -d '=' -f2)
SUPABASE_KEY=$(grep NEXT_PUBLIC_SUPABASE_ANON_KEY .env.local | cut -d '=' -f2)

# Extract project ref from URL
PROJECT_REF=$(echo $SUPABASE_URL | sed -n 's/.*https:\/\/\([^.]*\).*/\1/p')

echo "📍 Project: $PROJECT_REF"

# Check if supabase CLI is installed
if command -v supabase &> /dev/null; then
    echo "✅ Supabase CLI found"
    echo "📤 Pushing migration..."
    supabase db push --db-url "postgresql://postgres:[YOUR-PASSWORD]@db.$PROJECT_REF.supabase.co:5432/postgres"
else
    echo "⚠️  Supabase CLI not found"
    echo ""
    echo "📋 To install: npm install -g supabase"
    echo ""
    echo "📋 Or apply manually:"
    echo "1. Go to: https://supabase.com/dashboard/project/$PROJECT_REF/editor"
    echo "2. Open SQL Editor"
    echo "3. Copy contents of: supabase/migrations/20260109_client_therapist_relationships.sql"
    echo "4. Paste and run the SQL"
    echo ""
fi

echo "✅ Migration instructions provided"
