class DnsZonePolicy
  attr_reader :user, :record

  def initialize(user, item)
    @user = user
    @record = item
  end

  def permitted_attributes
    items = [:name, :kind, :active, :masters => [], :nameservers => []]
#    items.push(:client_id, :active, :disabled) if @user.hosting_owner? || @user.reseler_owner?
  end

  def index?
    true
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

  def axfr_retrieve?
    index?
  end

  def notify?
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
      @customer = Customer.find(user.customer.id)
    end

    def resolve
      return scope.includes(:dns_records).all if @user.hosting_owner?
      return scope.includes(:dns_records).where(customer: @user.customer)
    end

#    def get_reseller_customers
#      customers = Customer.where(reseller: @user.customer.reseller)
#    end
  end
end
