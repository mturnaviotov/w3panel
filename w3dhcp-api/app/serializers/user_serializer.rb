class UserSerializer < ActiveModel::Serializer

  cache key: 'user', expired_at: 3.hours

  attributes :id, :email, :active
	attribute :customer, serializer: CustomerNameSerializer
end
