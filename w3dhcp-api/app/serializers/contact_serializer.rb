class ContactSerializer < ActiveModel::Serializer

  cache key: 'contacts', expired_at: 3.hours

  attributes :id, :name, :email, :voice, :address, :city

  belongs_to :customer, serializer: CustomerNameSerializer

end
