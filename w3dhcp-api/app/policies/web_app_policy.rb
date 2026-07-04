class WebAppPolicy
  attr_reader :user, :record

  def initialize(user, web_app)
    @user = User.find(user.id)
    @record = web_app unless web_app.present?
  end

  def permitted_attributes
    attrs = Array.new [:name]
#    case @user.client
#      when :owner? then attrs << :app_server
#    end
    return attrs
  end

  def index?
    true #if @record.present?
  end

  def show?
    index?
  end

  def create?
    @user.hosting_owner?
  end

  def new?
    index?
  end

  def update?
    true if (@user.hosting_owner? || @user.customer == @record.customer)
  end

  def edit?
    update?
  end

  def start?
    update?
  end

  def stop?
    update?
  end

  def restart?
    update?
  end

  def block?
    @user.hosting_owner?
  end

  def unblock?
    @user.hosting_owner?
  end

  def destroy?
    true if @user.hosting_owner?
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
