class DomainZoneSerializer < ActiveModel::Serializer

  cache key: 'domain_zone', expired_at: 3.hours

  belongs_to   :registry

  attributes :id, :name, :name_ascii, :idn, :idn_only, :min_registration_period,
  :max_registration_period, :min_domain_length, :max_domain_length, :manual_processing, :licence_requirement,
  :files_upload_requirement, :proxy_contact_requirement, :period_hold_avail, :period_hold_length,
  :period_auto_renew_avail, :period_auto_renew_length, :period_redemption_avail, :period_redemption_length,
  :period_delete_avail, :period_delete_length, :comment,
  :domains_count, :created_at, :updated_at

  def domains_count
    object.domains.size
  end

end
