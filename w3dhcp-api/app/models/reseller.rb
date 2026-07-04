class Reseller < ApplicationRecord

  validate :check_only_one_operator, on: :create
  validate :check_unique_customer
  before_destroy :check_destroy_operator

  has_many :customers,      inverse_of: :reseller
	has_many :subscription_templates

  attr_accessor :customer_id
  after_save :assign_customer

  def owner
    customers.find_by(owner: true)
  end

	# ok
  def self.operator
    self.find_by(hosting_operator: true)
  end

	def name
		self.customers.find_by(owner: true).name
	end

  private
  def check_only_one_operator
    errors.add(:error,'Only one reseller can be operator') if hosting_operator? and !(Reseller.where(hosting_operator: true).empty?)
  end

  def check_destroy_operator
    errors.add(:error,"Can't destroy Operator") if self.hosting_operator
  end

  def check_unique_customer
    if customer_id.present?
      customer = Customer.find_by(id: customer_id)
      if customer && customer.owner? && customer.reseller_id != self.id
        errors.add(:error, 'This customer is already assigned as a reseller owner')
      end
    end
  end

  def assign_customer
    if customer_id.present?
      customer = Customer.find_by(id: customer_id)
      customer.update(reseller_id: self.id, owner: true) if customer
    end
  end

end
