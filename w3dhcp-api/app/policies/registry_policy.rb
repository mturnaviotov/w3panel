class RegistryPolicy
  attr_reader :user, :record

  def initialize(user, registry)
    @user = user
    @record = Registry.find(registry.id) if registry.respond_to?(:id)
  end

  def permitted_attributes
    [:name]
  end

  def index?
    @user.hosting_owner?
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

  def balance_update?
    index?
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
      scope.all #if @user.hosting_owner?
    end
  end
end
