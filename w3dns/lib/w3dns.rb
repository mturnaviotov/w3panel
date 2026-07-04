# frozen_string_literal: true

require_relative "w3dns/version"
require_relative "w3dns/gw"
require_relative "w3dns/zones"
require_relative "w3dns/zone"

module W3dns

	class Server

		attr_reader :server, :port, :password

		def self.configure (server = 'localhost', password = '', port = 8081, api = 'v1', instance = 'localhost')
			headers = {"Content-Type": "application/json", "Accept": "application/json", "X-API-Key": password }
			url = "http://#{server}:#{port}/api/#{api}/servers/#{instance}/"
			@gw = Gw.configure(url, headers)
			@zones = Zones.new(@gw)
			@zone = Zone.new(@gw)
			self
		end

		def self.server_name
			@server_name
		end

		def self.config
			@gw.request('config')
		end

		def self.zone
			@zone
		end

		def self.zones
			@zones
		end

	end

	class Error < StandardError; end

end
