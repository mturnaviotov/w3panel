class WebApp < ApplicationRecord
  include Eventable
	belongs_to :ip_address
	belongs_to :customer
  has_many :ftp_users, dependent: :destroy

  enum :app_type, { stub: 0, static: 1, redirect: 2, php5: 3, php7: 4 }

end
