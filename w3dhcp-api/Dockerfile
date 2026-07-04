FROM ruby:4.0.5-slim

# Install system dependencies
RUN apt-get update -qq && apt-get install -y \
  build-essential \
  libpq-dev \
  git \
  curl \
  && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install bundler version matching the Gemfile.lock
RUN gem install bundler && gem update --system 4.0.15

# Copy and build local dependencies
COPY mepp /tmp/mepp
RUN cd /tmp/mepp && gem build mepp.gemspec && gem install mepp-*.gem

COPY w3dns /tmp/w3dns
RUN cd /tmp/w3dns && gem build w3dns.gemspec && gem install w3dns-*.gem

# Copy dependency files first
COPY w3dhcp-api/Gemfile w3dhcp-api/Gemfile.lock ./

# Install ruby gems
RUN bundle install && bundle update

# Copy the rest of the application
COPY w3dhcp-api/ ./

# Copy and prepare entrypoint script
COPY w3dhcp-api/entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

# Expose port
EXPOSE 8082

# Start script
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0", "-p", "8082"]
