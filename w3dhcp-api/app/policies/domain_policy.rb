class DomainPolicy
  attr_reader :user, :record

  def initialize(user, domain)
    @user = user
    @record = Domain.find(domain.id) if domain.respond_to?(:id)
  end

  def permitted_attributes
    [:name, :comment_text, :renew_years, :customer_id, :registry_id, :nameservers => []]
  end

  def permitted_attributes_for_create
    [:name, :registry_id, :customer_id]
  end

  def permitted_attributes_for_group
    [options: [:renew_years], id: []]
  end

  def permitted_attributes_for_group_status
    [options: [:statuslist => {}], id: []]
  end

  def index?
    @user
  end

  def count?
    index? # if @user
  end

  def show?
    index? # @user.customer.eql?(@record.customer) || @user.customer.reseller_owner? || @user.customer.hosting_owner?
  end

  def group_epp_status?
    @user.customer.reseller_owner? || @user.customer.hosting_owner?
  end

  def create?
    @user.reseller_owner? || @user.hosting_owner?
  end


  def new?
    create?
  end

  def update?
    create? #@user.customer.eql?(@record.customer)
  end

  def update_comment?
    create? #@user.present?
  end

  def epp_update_info?
    create? #@user.customer.eql?(@record.customer) || @user.customer.reseller_owner? || @user.customer.hosting_owner?
  end

  def group_epp_update_info?
    create? # @user.customer.reseller_owner? || @user.customer.hosting_owner?
  end

  def epp_update_ns?
    create? #@user.customer.eql?(@record.customer) || @user.customer.reseller_owner? || @user.customer.hosting_owner?
  end

  def epp_delete?
    create? #@user.customer.hosting_owner?
  end

  def epp_restore?
    create? #@user.customer.hosting_owner?
  end

  def epp_renew?
    create? #@user.customer.hosting_owner?
  end

  def epp_status?
    create? #@user.customer.reseller_owner? || @user.customer.hosting_owner? 
  end

  def epp_hold?
    create? # @user.customer.reseller_owner? || @user.customer.hosting_owner?
  end

  def epp_unhold?
    create? #@user.customer.reseller_owner? || @user.customer.hosting_owner?
  end

  # Locked because it removed from database only when epp says that domain not available on registry
  def destroy?
    false
    #@user.customer.hosting_owner?
  end

  def scope
    Pundit.policy_scope!(user, record.class)
  end

  class Scope
    attr_reader :user, :scope

    def initialize(user, scope)
      @user = User.find(user.id)
      @scope = scope
#      @customer = Customer.find(user.customer)
    end

    def resolve
      return scope.includes(:customer, :domain_zone, :registry).all if @user.hosting_owner?
      return scope.includes(:customer, :domain_zone, :registry).where(customer: get_reseller_customers) if @user.reseller_owner?
      return scope.includes(:customer, :domain_zone, :registry).where(customer: @user.customer)
    end

    def get_reseller_customers
      Customer.where(reseller: @user.customer.reseller)
    end
  end
end
