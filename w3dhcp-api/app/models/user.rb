class User < ApplicationRecord

	belongs_to :customer
	has_secure_password

	# Verify that email field is not blank and that it doesn't already exist in the db (prevents duplicates):
	validates :email, presence: true, uniqueness: true

	def hosting_owner?
		self.customer.owner? && self.customer.reseller.hosting_operator?
	end

	def reseller_owner?
		self.customer.owner && self.customer.reseller.hosting_operator?
	end

end
