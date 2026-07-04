class OrderBriefSerializer < ActiveModel::Serializer

  cache key: 'order_brief', expired_at: 3.hours

  attributes :id, :number, :status, :summ

  belongs_to :customer
  belongs_to :reseller

end
