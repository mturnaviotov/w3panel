class DnsZone < ApplicationRecord
  include Eventable

	include W3dns

	validates :name, presence: true, uniqueness: true

	belongs_to :customer
	has_many :dns_records,		dependent: :destroy

	before_create do |zone|
		prepare_client
		@client.zone.create(zone.name, zone.masters, zone.nameservers, zone.kind, account: zone.customer.id)
	end

	after_create do |zone|
		prepare_client
		if kind == 'Slave'
			@client.zone.axfr_retrieve(zone[:name])
		end
		zone.reload_zone
	end

	before_destroy do |zone|
		prepare_client
		begin
			@client.zone.get(zone[:name]).delete
		rescue => e
			Rails.logger.warn("Failed to delete zone from PowerDNS: #{e.message}")
		end
	end

	def reload_zone
		prepare_client
		begin
			rrsets = @client.zone.get(self.name).to_hash.except(@except_keys)[:rrsets]
			rrsets.each do |set|
				data = dns_records.find_by(name: set[:name], record_type: set[:type])
				if data.nil?
					DnsRecord.create(name: set[:name], record_type: set[:type], comments: set[:comments],
					records: set[:records].map {|x| x[:content] }, ttl: set[:ttl], dns_zone: self)
				else
					if (data.records != (set[:records].map {|c| c[:content]}))
						data.records = set[:records].map {|c| c[:content]}
						data.save
					end
				end
			end
		rescue => e
			puts e
		end
	end

	private

	def prepare_client
		@except_keys = [:account, :notified_serial, :rrsets, :soa_edit, :soa_edit_api]
		@client = W3dns::Server.configure(
			ENV.fetch('DNS_SERVER_HOST', 'localhost'),
			ENV.fetch('DNS_SERVER_KEY', 'BO8zpNYJqJ7bc')
		)
	end
end
