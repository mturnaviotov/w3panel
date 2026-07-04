class Event < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :customer, optional: true

  enum :event_type, { info: 0, warning: 1, error: 2 }
  enum :event_action, { e_create: 0, e_update: 1, e_delete: 2 }

  default_scope { order(created_at: :desc) }
end
