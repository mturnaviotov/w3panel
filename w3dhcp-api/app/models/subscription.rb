class Subscription < ApplicationRecord
  include Eventable
  belongs_to :customer
  belongs_to :subscription_template
	has_one :domain
#  validates :name, presence: true, uniqueness: true
  validates :kind, presence: true

	enum :status, {created: 0, approved: 1, active: 2, disabled: 3}
	enum :kind, {domain: 10}

end
