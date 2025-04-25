#!/bin/bash

# ====== CONFIG ======
SSH_KEY="keyChina.pem"                   # dein SSH private key
SERVER_IP="212.227.74.41"                 # deine Server IP
REMOTE_DIR="/var/www/kakobuynext"             # Zielverzeichnis auf dem Server
LOCAL_PROJECT_DIR="./"                    # dein Projektordner lokal
PM2_PROCESS_NAME="23"    # PM2 Prozessname (neu: lieber Name statt ID verwenden)
# =====================

# Check if SSH key exists
if [ ! -f "$SSH_KEY" ]; then
  echo "Error: SSH key not found at $SSH_KEY"
  exit 1
fi

echo "🚀 Starting Deployment..."

# Step 1: Compress the project excluding unnecessary files
echo "🗜️ Compressing project..."
tar --exclude='.next' --exclude='node_modules' --exclude='.turbo' --exclude='.git' --exclude='out' -czf project.tar.gz -C "$LOCAL_PROJECT_DIR" .

# Step 2: Upload archive to server
echo "📤 Uploading project archive to server..."
scp -i "$SSH_KEY" project.tar.gz root@"$SERVER_IP":/tmp/project.tar.gz

# Step 3: Connect to server and deploy
echo "🔧 Deploying on server..."
ssh -t -i "$SSH_KEY" root@"$SERVER_IP" <<EOF
  set -e

  # Prepare new folder
  echo "📂 Creating remote project directory..."
  mkdir -p $REMOTE_DIR

  # Clean old code except persistent files like .env
  echo "🧹 Cleaning old project files..."
  find $REMOTE_DIR -mindepth 1 ! -name '.env' -exec rm -rf {} +

  # Extract new code
  echo "📦 Extracting new project files..."
  tar -xzf /tmp/project.tar.gz -C $REMOTE_DIR

  # Remove uploaded tar
  rm /tmp/project.tar.gz

  # Move into project directory
  cd $REMOTE_DIR

  # Install dependencies
  echo "📦 Installing dependencies..."
  npm install --frozen-lockfile

  # Build project
  echo "🛠️ Building project..."
  npm run build

  # Restart PM2
  echo "🔄 Restarting PM2 process..."
    pm2 restart $PM2_PROCESS_NAME
  fi

  pm2 save
EOF

# Step 4: Clean up local
echo "🧹 Removing local archive..."
rm project.tar.gz

echo "✅ Deployment complete!"

# Optional: Pause
read -p "Press [Enter] to close the terminal..."
