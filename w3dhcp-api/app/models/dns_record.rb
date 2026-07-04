class DnsRecord < ApplicationRecord

	include W3dns

	belongs_to :dns_zone

end
