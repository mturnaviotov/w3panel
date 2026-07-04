class Registry < ApplicationRecord
  include Eventable

  require 'yaml'

  has_many  :domains,      inverse_of: :registry
  has_many  :domain_zones

	validates :name, presence: true, uniqueness: true

  def epp_operations
    config = YAML.load_file('/opt/w3dhcp/config.yml')
    Mepp::Client.new(config[:providers][name.downcase.to_sym], {loglevel: 0, logpath: '/opt/w3dhcp/log/'} ) || nil
  end

  def balance_update
    begin
      self.balance = epp_operations.balance.to_i*100
      save!
    rescue
      return 0
    end
  end

end
