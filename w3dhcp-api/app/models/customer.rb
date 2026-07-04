class Customer < ApplicationRecord
  include Eventable
  belongs_to :reseller

  has_many :users, dependent: :destroy
  has_many :contacts, dependent: :destroy
  has_many :web_apps, dependent: :destroy
	has_many :dns_zones
  has_many :domains
  has_many :subscriptions, dependent: :destroy
  has_many :orders, dependent: :destroy

  before_destroy :prevent_owner_deletion

  private

  def prevent_owner_deletion
    if owner?
      errors.add(:base, 'Cannot delete the hosting owner')
      throw(:abort)
    end
  end
end
