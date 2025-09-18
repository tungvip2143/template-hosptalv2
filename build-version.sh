#!/bin/bash

ENV_FILE=".env"
DATE_PART=$(date +%Y%m%d)

# Dùng biến của GitLab nếu có, fallback nếu chạy local
UNIQUE_ID="${CI_PIPELINE_ID:-$(date +%s%N)}"

BUILD_VERSION="$DATE_PART-$UNIQUE_ID"

# Ghi ra .env cho frontend
grep -v '^VITE_BUILD_VERSION=' "$ENV_FILE" > "$ENV_FILE.tmp" 2>/dev/null || true
echo "VITE_BUILD_VERSION=$BUILD_VERSION" >> "$ENV_FILE.tmp"
mv "$ENV_FILE.tmp" "$ENV_FILE"

# Export cho CI sử dụng
export BUILD_VERSION="$BUILD_VERSION"
echo "✅ Build version: $BUILD_VERSION"