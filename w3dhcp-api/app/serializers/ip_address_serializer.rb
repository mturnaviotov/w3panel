class IpAddressSerializer < ActiveModel::Serializer

  cache key: 'ip_address', expired_at: 3.hours

  attributes :id, :ip, :shared, :default
end
