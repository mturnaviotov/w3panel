class BoardSerializer < ActiveModel::Serializer

#  cache key: 'board', expired_at: 1.hours

  attributes :name, :customer, #:balance

  attribute  :domains,			if: :domains_present?
  attribute  :customers,		if: :clients_present?
  attribute  :contacts, 		if: :contacts_present?
  attribute  :ftp_users, 		if: :ftp_users_present?
  attribute  :orders,       if: :orders_present?
  attribute  :domain_zones,	if: :domain_zones_present?
  attribute  :dns_zones,		if: :dns_zones_present?
  attribute  :subscriptions,	if: :subscriptions_present?
  attribute  :registries,		if: :registry_partners_present?
  attribute  :resellers,		if: :resellers_present?
#  attribute  :events,            if: :events_present?


  def domains_present?
    object.domains.present?
  end

  def customers_present?
    object.customers.present? if @current_user.reseller_owner?
  end

  def ftp_users_present?
    object.ftp_users.present?
  end

  def contacts_present?
    object.contacts.present?
  end

  def orders_present?
    object.orders.present?
  end

  def events_present?
    object.events.present?
  end

  def domain_zones_present?
    object.domain_zones.present? if @current_user.hosting_owner?
  end

  def dns_zones_present?
    object.dns_zones.present?
  end

  def registries_present?
    object.registries.present? if @current_user.hosting_owner?
  end

  def resellers_present?
    object.resellers.present? if @current_user.hosting_owner?
  end

  def subscriptions_present?
    object.subscriptions.present? if @current_user #.reseller_owner?
  end

end
