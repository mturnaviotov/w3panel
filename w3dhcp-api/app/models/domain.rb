class Domain < ApplicationRecord
  include Eventable

  include ToHash
  include Normalize

  belongs_to :domain_zone,      inverse_of: :domains
	belongs_to :subscription, optional: true
  belongs_to :customer,         inverse_of: :domains
  belongs_to :registry, inverse_of: :domains

  after_initialize :set_properties, if: :new_record?

  validates  :name_ascii,
             :presence => {:message => "Ascii Name can't be blank." },
             :uniqueness => {:message => "Name already exists."}

  validates  :name,
             :presence => {:message => "IDN Name can't be blank." },
             :uniqueness => {:message => "Name already exists."}

  validates  :domain_zone,
             :presence => {:message => "Domain zone must be present." }

  validates  :customer,
             :presence => {:message => "customer must be present." }

  validates  :registry,
             :presence => {:message => "Registry partner must be present." }

  attr_reader     :date_expire, :date_renew, :date_redemption, :idn, :price_register, :price_renew, :price_redemption

  scope :idn,            -> { where('name_idn not like name_ascii') }

  scope :hold,           -> { where("status @> ARRAY[?]::varchar[]", ['clientHold']) }
  scope :redemption,     -> { where("status @> ARRAY[?]::varchar[]", ['RedemptionPeriod']) }
  scope :pending_delete, -> { where("status @> ARRAY[?]::varchar[]", ['pendingDelete']) }
  scope :near_expire,    -> { where("dates->'exDate' >= ? and dates->'exDate' <= ?", DateTime.now-1.month, DateTime.now+2.month) }
  scope :name_like,      -> (domain) { where("name like ? or name_ascii like ?", domain<<'%', domain<<'%') }


  def self.can_delete
    domains = []
    pending_delete.map { |d| domain << d if DateTime.now > (d.date_redemption+5.days).midnight }
    domains
  end

  def set_properties
    self.name_ascii       = domain_to_ascii(self.name.downcase.strip)
    self.name             = domain_from_ascii(self.name_ascii)
    zone                  = self.name_ascii.split('.')[1..-1].join('.').gsub(/^\./, '')
    zone                  = '.' + zone if zone.present? && !zone.start_with?('.')
    self.domain_zone      = DomainZone.find_by(name: zone) if zone && DomainZone.find_by(name: zone).present?
    self.registry = (domain_zone.present? && domain_zone.registry) ? domain_zone.registry : nil
  end

  def name_short
    name.split('.')[0]
  end

  def date_expire
    dates['exDate'].to_datetime if self.dates['exDate']
  end

  def date_renew
    (date_expire + domain_zone.period_auto_renew_length.days) if date_expire
  end

  def date_redemption
    (date_expire + domain_zone.period_auto_renew_length.days + domain_zone.period_redemption_length.days) if date_expire
  end

  def expire_end?
   DateTime.now.between?(date_expire-7.days, date_expire) 
  end

  def renew_end?
   DateTime.now.between?(date_renew-7.days, date_renew)
  end

  def redemption_end?
   DateTime.now.between?(date_redemption-3.days, date_redemption)
  end

  def can_delete?
    DateTime.now >= (date_redemption+5.days).midnight
  end

### ------------------------------- EPP ----------------------------------------
  def self.epp_check(domain)
    Domain.new(name: domain).registry.epp_operations.domain_check(domain) if Domain.new(name: domain).registry.present?
  end

  def self.epp_info(domain)
    Domain.new(name: domain).registry.epp_operations.domain_info(domain)
  end

### ----------------------------------------------------------------------------

  def epp_hold(current_user, remote_ip)
    registry.epp_operations.domain_status_add(name_ascii, ['clientHold'])
#    Event.create(event_type: :info, event_action: :e_update, ip: remote_ip,
#      user: current_user, customer: current_user.customer, item_url: url,
#      item: name, description: "Domain is hold now")
    epp_update_info
  end

  def epp_unhold(current_user, remote_ip)
    registry.epp_operations.domain_status_rem(name_ascii, ['clientHold'])
#    Event.create(event_type: :info, event_action: :e_update, ip: remote_ip,
#      user: current_user, customer: current_user.customer, item_url: url,
#      item: name, description: "Domain is unhold now")
    epp_update_info
  end

  def epp_status_add(statuslist, current_user, remote_ip)
    registry.epp_operations.domain_status_add(name_ascii, statuslist)
#    Event.create(event_type: :info, event_action: :e_update, ip: remote_ip,
#     user: current_user, customer: current_user.customer, item_url: url,
#     item: name, description: "Domain statuses added")
    epp_update_info
  end

  def epp_status_rem(statuslist, current_user, remote_ip)
    registry.epp_operations.domain_status_rem(name_ascii, statuslist)
#    Event.create(event_type: :info, event_action: :e_update, ip: remote_ip,
#      user: current_user, customer: current_user.customer, item_url: url,
#      item: name, description: "Domain statuses removed")
    epp_update_info
  end

### ----------------------------------------------------------------------------

  def epp_renew(period, current_user, remote_ip)
    registry.epp_operations.domain_renew(name_ascii, period)
#    Event.create(event_type: :info, event_action: :e_update, ip: remote_ip,
#      user: current_user, customer: current_user.customer, item_url: url,
#      item: name, description: "Domain is renewed for #{period} year(s) now")
    epp_update_info
  end

  def epp_update_info
    self.update(registry.epp_operations.domain_info(name_ascii).except(:name))
  end

  def epp_update_ns(nameservers, current_user, remote_ip)
    nameservers.map {|s| s.gsub(/.$/, '')}
    registry.epp_operations.domain_update_ns(name_ascii, nameservers)
#    Event.create(event_type: :info, event_action: :e_update, ip: remote_ip,
#      user: current_user, customer: current_user.customer, item_url: url,
#      item: name, description: "Domain name servers updated")
    epp_update_info
  end

### ----------------------------------------------------------------------------
### ----------------------------------------------------------------------------

  def epp_delete(current_user, remote_ip)
    registry.epp_operations.domain_delete(name_ascii)
#    Event.create(event_type: :info, event_action: :e_destroy, ip: remote_ip,
#      user: current_user, customer: current_user.customer, item_url: url,
#      item: name, description: "Domain is set as deleted")
    epp_update_info
  end

  def epp_restore(current_user, remote_ip)
    registry.epp_operations.domain_restore(name_ascii)
#    Event.create(event_type: :info, event_action: :e_update, ip: remote_ip,
#      user: current_user, customer: current_user.customer, item_url: url,
#      item: name, description: "Domain is set to restore")
    epp_update_info
  end

end
