class DnsZoneSerializer < ActiveModel::Serializer

  cache key: 'dns_zone', expired_at: 3.hours

  belongs_to :customer, serializer: CustomerNameSerializer

  attributes :id, :name, :kind, :masters, :nameservers, :serial, :active, :disabled, :created_at, :updated_at

end
