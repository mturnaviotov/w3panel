class CustomerIndexSerializer < ActiveModel::Serializer

  cache key: 'customer_index', expired_at: 3.hours

  attributes :id, :name, :owner, :corporate

  belongs_to :reseller, serializer: ResellerNameSerializer

end
