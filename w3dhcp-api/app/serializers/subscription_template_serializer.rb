class SubscriptionTemplateSerializer < ActiveModel::Serializer

  cache key: 'subscription_template', expired_at: 3.hours

  attributes :id, :name, :kind, :term, :listed, :register, :renew, :transfer, :redemption, :disk, :disk_unit, :web_apps, :databases, :dns
	belongs_to :reseller, serializer: ResellerNameSerializer
end
