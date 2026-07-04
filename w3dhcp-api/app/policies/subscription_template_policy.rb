class SubscriptionTemplatePolicy
  attr_reader :user, :record

  def initialize(user, record)
    @user = User.find(user.id)
    @record = record
  end

  def permitted_attributes
   [ :id, :name, :kind, :term, :listed, :register, :renew, :transfer, :redemption, :disk, :disk_unit, :web_apps, :databases, :dns, :reseller_id]
  end

  def index?
		@user.reseller_owner?
  end

	def list
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
      return scope.where(reseller: @user.customer.reseller) if @user.reseller_owner?
    end

  end
end
