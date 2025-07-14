#!/bin/bash

# ===============================
# Settings
# ===============================
SCHEMA_URL="http://localhost:3030/api/docs-json"

# Get full login response and extract token
AUTH_TOKEN=$(curl -s -X POST 'http://127.0.0.1:3030/api/authentication/login/1' \
  -H 'accept: */*' \
  -H 'Locale: en' \
  -H 'isLocalized: false' \
  -H 'Content-Type: application/json' \
  -d '{
    "fcm": "user",
    "email": "admin2@admin.com",
    "password": "Default@123"
  }' | jq -r '.data.AccessToken')

# ===============================
# Verify token
# ===============================
if [ -z "$AUTH_TOKEN" ] || [ "$AUTH_TOKEN" == "null" ]; then
  echo "❌ Failed to extract AccessToken"
  exit 1
fi

echo "🔑 Using AccessToken: $AUTH_TOKEN"

# ===============================
# Run Schemathesis
# ===============================
echo "🔍 Running Schemathesis on $SCHEMA_URL"

schemathesis run "$SCHEMA_URL" \
  --header="Authorization: Bearer $AUTH_TOKEN" \
  --header="Content-Type: application/json" \
  --header="Locale: en" \
  --header="isLocalized: false" \
