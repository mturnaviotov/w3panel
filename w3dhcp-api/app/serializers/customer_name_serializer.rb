class CustomerNameSerializer < ActiveModel::Serializer

  cache key: 'customer_name', expired_at: 3.hours

  attributes :id, :name

end
