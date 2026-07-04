class SubscriptionTemplate < ApplicationRecord
  include Eventable

	enum :kind, { balance: 0, domain: 10 }

  validates :name, presence: true, uniqueness: true

  belongs_to :reseller
end
