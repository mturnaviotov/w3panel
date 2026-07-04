class DomainZonePolicy
  attr_reader :user, :record

  def initialize(user, record)
    @user = user
    @record = record
  end

  def permitted_attributes
    [:name, :name_ascii, :idn, :idn_only, :price_internal, :price_register, :price_renew, :price_transfer,
     :price_redemption, :min_registration_period, :max_registration_period, :min_domain_length,
     :max_domain_length, :manual_processing, :licence_requirement, :files_upload_requirement,
     :proxy_contact_requirement, :period_hold_avail, :period_hold_length, :period_auto_renew_avail,
     :period_auto_renew_length, :period_redemption_avail, :period_redemption_length, :period_delete_avail,
     :period_delete_length, :comment, :registry_id]
  end

  def index?
    true if @user.hosting_owner?
  end

  def show?
    index?
  end

  def create?
    index?
  end

  def update?
    index?
  end

  def destroy?
    index?
  end

  def scope
    Pundit.policy_scope!(user, record.class)
  end

  class Scope
    attr_reader :user, :scope

    def initialize(user, scope)
      @user = User.find(user.id)
      @scope = scope
      #@customer = Customer.find(user.customer_id)
    end

    def resolve
      scope.all if @user.hosting_owner?
    end

  end
end
