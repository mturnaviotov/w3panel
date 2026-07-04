class OrderPolicy
  attr_reader :user, :record

  def initialize(user, order)
    @user = user
    @record = order
  end

  def permitted_attributes
    [:items => [:name, :name_ascii, :kind, :operation]]
  end

  def permitted_attributes_for_approve
    [:approve]
  end

  def index?
    true #if @user
  end

  def show?
    @user.customer == @record.customer
  end

  def create?
    index?
  end

  def destroy?
    false #((@record.client == @user.client) || @client.is_reseller?) && @record.status.eql?('created')
  end

  def approve?
   false # (@user.client == @record.client) || @client.is_reseller?
  end

  def scope
    Pundit.policy_scope!(user, record.class)
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
      Customers.where(reseller: @user.customer.reseller)
    end
  end
end
