#!/bin/bash
set -e

export DISABLE_SPRING=1

# Remove a potentially pre-existing server.pid for Rails.
rm -f /app/tmp/pids/server.pid

# Run database migrations/preparation only if starting the Rails server
if [ "$1" = "bundle" ] && [ "$2" = "exec" ] && [ "$3" = "rails" ] && [ "$4" = "server" ]; then
  echo "Preparing database..."
  bundle exec rails db:prepare
  bundle exec rails db:seed
  echo "Database prepared and seeded."
fi

# Then exec the container's main process (what's set as CMD in the Dockerfile).
exec "$@"
