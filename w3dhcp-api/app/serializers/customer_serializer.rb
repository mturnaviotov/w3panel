class CustomerSerializer < ActiveModel::Serializer

  cache key: 'customer', expired_at: 3.hours

  attributes :id, :name, :owner, :corporate

  belongs_to :reseller, serializer: ResellerSerializer

  has_many :contacts
	has_many :domains
end
