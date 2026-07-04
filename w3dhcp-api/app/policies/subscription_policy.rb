class SubscriptionPolicy
  attr_reader :user, :record

  def initialize(user, record)
    @user = user
    @record = record
  end

  def index?
    @user.present?
  end

  def show?
    @record.customer == @user.customer
  end

  def create?
    false
  end

  def update?
    false
  end

  def destroy?
    false
  end

  class Scope
    attr_reader :user, :scope

    def initialize(user, scope)
      @user = user
      @scope = scope
    end

    def resolve
      return scope.all if @user.hosting_owner?
      return scope.where(customer: get_reseller_customers) if @user.reseller_owner?
      return scope.where(customer: @user.customer) if !(@user.hosting_owner? && @user.reseller_owner?)
    end

    def get_reseller_customers
      customers = Customers.where(reseller: @user.customer.reseller)
    end

  end
end
