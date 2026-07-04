class DnsZoneShortSerializer < ActiveModel::Serializer

  cache key: 'dns_zone_short', expired_at: 3.hours

  belongs_to :customer, serializer: CustomerNameSerializer

#  has_many :dns_records

  attributes :id, :name, :kind, :masters, :nameservers, :serial, :active, :disabled

end
