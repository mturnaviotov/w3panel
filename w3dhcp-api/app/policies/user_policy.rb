class UserPolicy
  attr_reader :user, :record

  def initialize(user, record)
    @user = User.find(user.id) if user
    @record = record if record
  end

  def permitted_attributes
    [:email, :password, :customer_id]
  end

  def permitted_register_attributes
  	[:name, :customer_name, :voice, :email, :password, :corporate]
  end

  def index?
    true if @user
#record.present?
  end

  def register?
    true if @user
#record.present?
  end

  def show?
    index?
  end

  def create?
	index?
  end


  def update?
    true if (@user.customer == @record.customer)
  end


  def destroy?
    true if @user#.hosting_owner?
  end

  def scope
    Pundit.policy_scope!(@user, @record.class)
  end

  class Scope
    attr_reader :user, :scope

    def initialize(user, scope)
      @user = User.find(user.id)
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
