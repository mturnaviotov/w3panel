class EventSerializer < ActiveModel::Serializer
  attributes :id, :event_type, :event_action, :ip, :item_url, :item, :description, :created_at

  belongs_to :customer, serializer: CustomerNameSerializer
  belongs_to :user
end
