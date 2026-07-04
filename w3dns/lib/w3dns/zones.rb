module W3dns

	class Zones

		def initialize(gw)
			@gw = gw
			self
		end

		def all
			load_zones
		end

		def self.find_by_name(name)
			@zones.find{|zone| zone if zone[:name] == name }
		end

		private

		def load_zones
			response = @gw.request('zones')
			raise 'Failed to fetch zones' if response[:code] != '200'
			response[:body].map{ |zone| Zone.parse(zone)}
		end

	end
end
