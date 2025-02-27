#!/bin/bash

# Setup script for Wisconsin Inmate Lookup application

echo "Setting up Wisconsin Inmate Lookup application..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
  echo "Creating .env.local file..."
  cp .env.local.example .env.local
  echo "Please update .env.local with your Supabase credentials"
fi

# Create temp directory for PDF storage
echo "Creating temp directory for PDF storage..."
mkdir -p temp

# Make scripts executable
echo "Making scripts executable..."
chmod +x scripts/*.js

echo "Setup complete! You can now run the application with:"
echo "npm run dev"
echo ""
echo "Available scripts:"
echo "- npm run dev: Start the development server"
echo "- npm run build: Build the application for production"
echo "- npm run start: Start the production server"
echo "- npm run start:with-scheduler: Start the production server with scheduler"
echo "- npm run init-counties: Initialize the counties table"
echo "- npm run init-scheduler: Initialize the scheduler"
echo "- npm run init-all: Initialize both counties and scheduler"
echo "- npm run scrape: Trigger immediate scraping"
echo "- npm run refresh: Refresh all inmate data"
echo ""
echo "Don't forget to update your .env.local file with your Supabase credentials."
echo "You'll also need to create the 'inmates' and 'counties' tables in your Supabase project." 