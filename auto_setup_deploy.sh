#!/bin/bash
# ===============================
# Super Script: Setup DB + Supabase + Deploy Render
# ===============================

# ==== CẤU HÌNH CẦN THAY ====
RENDER_API_KEY="your_render_api_key"
SERVICE_NAME="melbetblog-db"
WEB_SERVICE_ID="your_render_web_service_id"   # Lấy từ Render API (service web)
ORG_ID="your_supabase_org_id"                 # Lấy bằng: supabase org list
REGION="ap-southeast-1"                       # Singapore cho tốc độ VN
PROJECT_NAME="melbetblog"
# ===============================

echo "🚀 Bắt đầu auto setup..."

# ==== 1. TẠO POSTGRES DB TRÊN RENDER ====
echo "📦 Tạo Postgres DB trên Render..."
DB_RESPONSE=$(curl -s -X POST "https://api.render.com/v1/services" \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "postgres",
    "name": "'"$SERVICE_NAME"'",
    "plan": "free",
    "region": "oregon"
  }')

DB_ID=$(echo $DB_RESPONSE | jq -r '.id')

sleep 20

DB_INFO=$(curl -s "https://api.render.com/v1/services/$DB_ID/env-vars" \
  -H "Authorization: Bearer $RENDER_API_KEY")

DATABASE_URL=$(echo $DB_INFO | jq -r '.[] | select(.key=="DATABASE_URL") | .value')
echo "DATABASE_URL=$DATABASE_URL" >> .env
echo "✅ DATABASE_URL đã thêm vào .env"

# ==== 2. TẠO SUPABASE PROJECT + BUCKET ====
echo "🌐 Tạo Supabase project..."
supabase projects create $PROJECT_NAME \
  --organization-id $ORG_ID \
  --db-password "MelbetPass123!" \
  --region $REGION \
  --plan free

PROJECT_ID=$(supabase projects list --json | jq -r '.[] | select(.name=="'$PROJECT_NAME'") | .id')

SUPABASE_URL=$(supabase projects list --json | jq -r '.[] | select(.id=="'$PROJECT_ID'") | .api.projectUrl')
SUPABASE_ANON_KEY=$(supabase projects list --json | jq -r '.[] | select(.id=="'$PROJECT_ID'") | .api.anonKey')

supabase storage create-bucket images --project-ref $PROJECT_ID --public

echo "NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL" >> .env
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY" >> .env
echo "✅ Supabase + bucket images đã setup"

# ==== 3. GIT PUSH LÊN GITHUB ====
echo "🔄 Push code lên GitHub..."
git add .
git commit -m "Auto setup and deploy"
git push origin main

# ==== 4. DEPLOY TRÊN RENDER ====
echo "🚀 Trigger deploy trên Render..."
curl -s -X POST "https://api.render.com/v1/services/$WEB_SERVICE_ID/deploys" \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json"

echo "✅ Hoàn tất! Web sẽ được build & deploy trên Render."
