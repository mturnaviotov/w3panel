class ResellerSerializer < ActiveModel::Serializer

  cache key: 'reseller', expired_at: 3.hours

  attributes :id, :hosting_operator, :name

end
