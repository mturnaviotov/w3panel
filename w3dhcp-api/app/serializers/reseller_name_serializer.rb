class ResellerNameSerializer < ActiveModel::Serializer

  cache key: 'reseller_name', expired_at: 3.hours

  attributes :id, :name

end
