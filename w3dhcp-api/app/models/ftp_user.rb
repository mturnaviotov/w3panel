class FtpUser < ApplicationRecord
  include Eventable
  belongs_to :customer
  belongs_to :web_app

  validates :username, uniqueness: true

  before_validation :sync_from_web_app

  private

  def sync_from_web_app
    if web_app
      self.customer_id = web_app.customer_id
      self.uid = web_app.system_uid
      self.gid = web_app.system_uid
      self.homedir = web_app.web_root
      self.application_server = web_app.application_server
      self.ip_address_id = web_app.ip_address_id
    end
  end
end
