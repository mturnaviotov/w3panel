class SubscriptionSerializer < ActiveModel::Serializer

  cache key: 'subscription', expired_at: 3.hours

  attributes :id, :name, :kind, :status, :expiration
	belongs_to :subscription_template, serializer: SubscriptionTemplateNameSerializer
	belongs_to :customer, serializer: CustomerNameSerializer
end
