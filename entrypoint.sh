#!/bin/bash

# Debug database url
echo "DATABASE_URL: $DATABASE_URL"

# Run the database migrations
prisma migrate dev

# Run the database migrations
prisma migrate deploy

# Run the app
cross-env NODE_ENV=production node -r newrelic ./server.js
