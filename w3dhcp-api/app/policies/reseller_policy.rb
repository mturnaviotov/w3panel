class ResellerPolicy
  attr_reader :user, :record

  def initialize(user, reseller)
    @user = user
    @record = reseller
    @client = user.customer
  end

  def permitted_attributes
    [ :reseller_owner, :customer_id ]
  end

  def index?
		@user.hosting_owner?
  end

  def show?
    #scope.where(:id => record.id).exists?
    index?
  end

  def create?
    @user.hosting_owner?
  end

  def new?
    create?
  end

  def update?
    @user.hosting_owner?
  end

  def edit?
    update?
  end

  def destroy?
    @user.hosting_owner?
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
      scope.all
    end
  end
end
