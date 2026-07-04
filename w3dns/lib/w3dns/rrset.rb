require 'w3dns/record'
require 'w3dns/constants'

module W3dns

	class Rrset

		attr_accessor :name, :records, :ttl, :type, :changetype, :comments

		@gw

		def initialize(gw)
			@gw = gw
			self
	 end

		def to_s
			"name: #@name, type: #@type, comments: #@comments, records: #@records, ttl: #@ttl"
		end

		def to_json(*a)
			to_hash.to_json
		end

		def to_hash
			{ name: @name, type: @type, comments: @comments, records: @records.map {|r| r.to_hash}, ttl: @ttl, changetype: @changetype }
		end

		def save
			puts self.to_json
			response = @gw.request("zones/#@name", {rrsets: [self]}, 'patch')
			raise 'Failed to save zone' if response[:code] != '204'
			response
		end

		def parse(rrset)
			generate(rrset)
		end

		private
		def generate(rrset)
			@name = rrset[:name] if rrset[:name]
			raise "#{rrset[:name]}: Not a name" if rrset[:name] && !rrset[:name].match?(REGEX_FQDNNAME)
			@type = rrset[:type].upcase if rrset[:type]
			if rrset[:records].any?
				case @type
					when 'A'
						rrset[:records].each {|record| raise "#{record[:content]}: Not a IP" if !record[:content].match?(REGEX_IP)}
					when 'CNAME', 'NS'
						rrset[:records].each {|record| raise "#{record[:content]}: Not a Name" if !record[:content].match?(REGEX_FQDNNAME)}
					when 'AAAA'
						rrset[:records].each {|record| raise "#{record[:content]}: Not a IPv6 address" if !record[:content].match?(REGEX_IPV6)}
					when 'MX'
						rrset[:records].each {|record| raise "#{record[:content]}: Not a MX record" if !record[:content].match?(REGEX_MX)}
				end
				@records = rrset[:records].map {|record| Record.new(record)}
			end
			@ttl = rrset[:ttl] ||= 3600
			@comments = rrset[:comments] ||= []
			@changetype = rrset[:changetype] ||= 'REPLACE'
			self
		end

	end
end
