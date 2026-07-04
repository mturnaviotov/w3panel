class DomainZoneNameSerializer < ActiveModel::Serializer

  cache key: 'domain_zone_name', expired_at: 3.hours

  attributes :id, :name

end
