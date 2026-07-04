RAILS_ENV=development PIDFILE=/opt/w3dhcp/w3dhcp/tmp/pids/resque-${RAILS_ENV}.pid QUEUE=\* BACKGROUND=yes rake environment resque:work
BACKGROUND=yes 