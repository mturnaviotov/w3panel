class FtpUserPolicy
  attr_reader :user, :record

  def initialize(user, record)
    @user = User.find(user.id)
    @record = record
  end

  def permitted_attributes
    [:username, :password, :web_app_id]
  end

  def permitted_attributes_for_update
    [:password]
  end

  def index?
    true #if @record.present?
  end

  def show?
    index?
  end

  def create?
    true
  end

  def new?
    index?
  end

  def update?
    true if (@user.customer == @record.customer)
  end

  def edit?
    update?
  end

  def destroy?
    true if (@user.hosting_owner? || @user.customer == @record.customer)
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
