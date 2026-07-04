class OrderSerializer < ActiveModel::Serializer

  cache key: 'order', expired_at: 3.hours

  attributes :id, :number, :status, :summ, :items

  belongs_to :customer
  belongs_to :reseller

end
