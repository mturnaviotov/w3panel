require 'w3dns/rrset'

module W3dns
	class Zone

		attr_accessor :account, :dnssec, :kind, :masters, :nameservers, :name, :notified_serial, :rrsets, :serial

		attr_reader :id, :last_check, :notified_serial, :url, :soa_edit, :soa_edit_api

		def initialize(gw)
			@gw = gw
			self
		end

		# name with trailing dot, array of ip masters, array of nameservers as hostnames, type, account
		def create(name, masters, nameservers, type, account)
			begin
				raise "Zone already exist" if check(name) == true
				raise "Nameserver can't be IP" if !nameservers.select{|name| name if name.match(REGEX_IP)}.empty?
				n2 = nameservers.map do |item|
					if (item !~ /\.$/ )
						item << '.'
					else
						item
					end
				end
				m2 = masters.map do |item|
					if (item !~ /\.$/ )
						item << '.'
					else
						item
					end
				end
				if (name !~ /\.$/ )
					name << '.'
				end	
				body = { "name": name, "kind": type,  "nameservers": n2, "masters": m2, "account": account,
						"soa_edit": "INCEPTION-INCREMENT", "soa_edit_api": "INCEPTION-INCREMENT"}
				@gw.request('zones', body, 'post')
				get(name)
			rescue => e
				return e
			end
		end

		def update_record(name, type, values)
			records = values.map {|item| {content: item, disabled: false}}
			rrset = {rrsets: [{name: name, type: type, changetype: 'REPLACE', records: records, ttl: 3600, comments: []}]}
			n = @name.end_with?('.') ? @name : "#{@name}."
			@gw.request('zones/'+n, rrset, 'patch')
			get(@name)
			soa
		end

		def delete_record(name, type)
			rrset = {rrsets: [{name: name, type: type, changetype: 'DELETE'}]}
			n = @name.end_with?('.') ? @name : "#{@name}."
			@gw.request('zones/'+n, rrset, 'patch')
			get(@name)
			soa
		end

		def delete
			n = @name.end_with?('.') ? @name : "#{@name}."
			@gw.request("zones/#{n}", '', 'delete')
		end

		def axfr_retrieve(name)
			n = name.end_with?('.') ? name : "#{name}."
			#response = 
			@gw.request("zones/#{n}/axfr-retrieve", '', 'put')
			#raise 'Failed to axfr retrieve zone. It absent?' if response[:code] != '200'
			#response
		end

		def notify(name)
			n = name.end_with?('.') ? name : "#{name}."
			#response = 
			@gw.request("zones/#{n}/notify", '', 'put')
			#raise 'Failed to notify zone. It absent?' if response[:code] != '200'
			#response
		end

		def to_s
			to_hash.to_s
		end

		def check(name)
			n = name.end_with?('.') ? name : "#{name}."
			response = @gw.request("zones/#{n}", '')
			true if response[:code] == '200'
		end

		def update
			get(@name)
		end


		def soa
			@rrsets.select {|i| i.to_hash[:type] =~ /(SOA)/ }.first
		end

		def to_json
			to_hash.to_json
		end

		def to_hash
			{ account: @account, kind: @kind, masters: @masters, name: @name,
					rrsets: @rrsets.map {|r| r.to_hash}, serial: @serial }
		end

		def save
			n = @name.end_with?('.') ? @name : "#{@name}."
			response = @gw.request("zones/#{n}", to_json, 'patch')
			#raise 'Failed to save zone' if response[:code] != '204'
			response
		end

		def get(name)
			n = name.end_with?('.') ? name : "#{name}."
			response = @gw.request("zones/#{n}", '')
			raise 'Failed to fetch zone' if response[:code] != '200'
			generate(response[:body]) if response[:code] == '200'
			self
		end

		def parse(zone)
			generate(zone)
			self
		end

		#private
		def generate(zone)
			@name = zone[:name]
			@account = zone[:account]
			@dnssec = zone[:dnssec]
			@id = zone[:id]
			@kind = zone[:kind]
			@last_check = zone[:last_check]
			@masters = zone[:masters]
			@name = zone[:name]
			@notified_serial = zone[:notified_serial]
			@rrsets = zone[:rrsets].map {|rrset| set = Rrset.new(@gw); set.parse(rrset)}
			@serial = zone[:serial]
			@soa_edit = zone[:soa_edit]
			@soa_edit_api = zone[:soa_edit_api]
			@url = zone[:url]
			self
		end

  end
end
