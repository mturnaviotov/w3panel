class SubscriptionTemplateNameSerializer < ActiveModel::Serializer

  cache key: 'subscription_template_name', expired_at: 3.hours

  attributes :id, :name
end
