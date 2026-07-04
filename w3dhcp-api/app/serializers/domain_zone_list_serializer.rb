class DomainZoneListSerializer < ActiveModel::Serializer

  cache key: 'domain_zone_list', expired_at: 3.hours

  attributes :id, :name, :name_ascii, :idn
#	has_many :zone_prices, each_serializer: ZonePriceListSerializer

end
