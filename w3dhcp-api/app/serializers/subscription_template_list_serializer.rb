class SubscriptionTemplateListSerializer < ActiveModel::Serializer

  cache key: 'subscription_template_list', expired_at: 3.hours

  attributes :id, :name, :kind, :term, :register, :renew, :transfer, :redemption, :disk, :disk_unit, :web_apps, :databases, :dns
end
