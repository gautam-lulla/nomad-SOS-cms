#!/bin/bash

# Upload images to Cloudflare R2 CDN
#
# Prerequisites:
#   - wrangler CLI installed: npm install -g wrangler
#   - wrangler logged in: wrangler login
#   - R2 bucket configured
#
# Usage:
#   ./scripts/upload-to-r2.sh

# Configuration
BUCKET_NAME="sphereos-media"
SOURCE_DIR="./public/images-backup"
CDN_PREFIX="nomad"

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "Error: wrangler CLI not found. Install with: npm install -g wrangler"
    exit 1
fi

echo "========================================="
echo "Uploading images to Cloudflare R2"
echo "========================================="
echo "Bucket: $BUCKET_NAME"
echo "Source: $SOURCE_DIR"
echo "CDN Prefix: $CDN_PREFIX"
echo ""

# Function to upload a file
upload_file() {
    local file=$1
    local rel_path=${file#$SOURCE_DIR/}
    local dest_path="$CDN_PREFIX/$rel_path"

    echo "Uploading: $rel_path -> $dest_path"
    wrangler r2 object put "$BUCKET_NAME/$dest_path" --file="$file" --content-type="$(file --mime-type -b "$file")"
}

# Find and upload all images
find "$SOURCE_DIR" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.svg" -o -name "*.webp" \) | while read -r file; do
    upload_file "$file"
done

echo ""
echo "========================================="
echo "Upload complete!"
echo "========================================="
echo "Images are now available at:"
echo "https://pub-21daddc5e64940d8bfac214df111cd0c.r2.dev/$CDN_PREFIX/"
